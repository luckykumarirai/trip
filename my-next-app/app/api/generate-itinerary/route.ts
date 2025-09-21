// app/api/generate-itinerary/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';
import { FormData, ItineraryData, ApiResponse } from '@/types/trip';

// Initialize Vertex AI
let vertex_ai: VertexAI | null = null;
let generativeModel: any = null;

try {
  vertex_ai = new VertexAI({
    project: process.env.GOOGLE_CLOUD_PROJECT_ID!,
    location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
  });

  generativeModel = vertex_ai.preview.getGenerativeModel({
    model: 'gemini-1.5-pro-preview-0409',
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 0.7,
      topP: 0.8,
    },
  });
} catch (error) {
  console.error('Failed to initialize Vertex AI:', error);
}

// Simple in-memory cache
interface CacheItem {
  data: ItineraryData;
  timestamp: number;
}

const cache = new Map<string, CacheItem>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

function getCacheKey(formData: FormData): string {
  return JSON.stringify({
    destination: formData.destination,
    duration: formData.duration,
    travelStyle: formData.travelStyle,
    groupType: formData.groupType,
    foodPreference: formData.foodPreference,
    interests: formData.travelInterests.sort(),
  });
}

function generateDetailedPrompt(formData: FormData): string {
  const {
    destination,
    duration,
    travelStyle,
    groupType,
    foodPreference,
    travelInterests,
    pickupLocation
  } = formData;

  return `
Generate a comprehensive ${duration}-day travel itinerary for ${destination}.

TRIP CONTEXT:
- Destination: ${destination}
- Duration: ${duration} days
- Travel Style: ${travelStyle} (adjust recommendations accordingly)
- Group Type: ${groupType}
- Food Preference: ${foodPreference}
- Interests: ${travelInterests.join(', ')}
- Starting Point: ${pickupLocation || 'Not specified'}

Return ONLY a valid JSON object with this exact structure:

{
  "destinationSummary": "string",
  "dailyItineraries": [
    {
      "day": number,
      "title": "string",
      "morning": {
        "activity": "string",
        "description": "string",
        "location": "string",
        "duration": "string",
        "cost": "string"
      },
      "afternoon": {
        "activity": "string",
        "description": "string",
        "location": "string",
        "duration": "string",
        "cost": "string"
      },
      "evening": {
        "activity": "string",
        "description": "string",
        "location": "string",
        "duration": "string",
        "cost": "string"
      },
      "foodRecommendations": [
        {
          "name": "string",
          "type": "string",
          "speciality": "string",
          "priceRange": "string"
        }
      ],
      "transportationTips": "string",
      "culturalTips": "string",
      "estimatedDailyCost": "string"
    }
  ],
  "recommendations": [
    {
      "category": "string",
      "title": "string",
      "description": "string",
      "location": "string",
      "rating": "string",
      "priceRange": "string",
      "bestTimeToVisit": "string",
      "duration": "string"
    }
  ],
  "costBreakdown": {
    "accommodation": "string",
    "food": "string",
    "transportation": "string",
    "activities": "string",
    "shopping": "string",
    "miscellaneous": "string",
    "total": "string",
    "dailyAverage": "string"
  },
  "travelTips": {
    "transportation": ["string"],
    "moneySaving": ["string"],
    "cultural": ["string"],
    "weather": "string",
    "packing": ["string"]
  }
}

Make all recommendations specific to ${destination}, realistic for ${travelStyle} budget, and tailored for ${groupType} travelers.
`;
}

function generateFallbackItinerary(formData: Partial<FormData>): ItineraryData {
  const { 
    destination = 'Goa', 
    duration = '3', 
    travelStyle = 'budget',
    groupType = 'Couple',
    foodPreference = 'Any'
  } = formData;
  
  const days = parseInt(duration) || 3;
  
  return {
    destinationSummary: `${destination} is a wonderful destination offering rich culture, beautiful landscapes, and unforgettable experiences perfect for ${groupType} travelers.`,
    
    dailyItineraries: Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}: Exploring ${destination}`,
      morning: {
        activity: "Local Sightseeing",
        description: "Explore the main attractions and cultural sites",
        location: "City Center",
        duration: "3-4 hours",
        cost: travelStyle === 'budget' ? "₹500-1,000" : "₹1,500-2,500"
      },
      afternoon: {
        activity: "Cultural Experience",
        description: "Immerse in local culture and traditions",
        location: "Cultural District",
        duration: "2-3 hours",
        cost: travelStyle === 'budget' ? "₹300-600" : "₹800-1,500"
      },
      evening: {
        activity: "Local Cuisine",
        description: "Experience authentic local dining",
        location: "Food Street",
        duration: "2 hours",
        cost: travelStyle === 'budget' ? "₹400-800" : "₹1,000-2,000"
      },
      foodRecommendations: [{
        name: "Local Restaurant",
        type: foodPreference === 'Veg' ? 'Vegetarian' : 'Traditional',
        speciality: `Authentic ${destination} cuisine`,
        priceRange: travelStyle === 'budget' ? "₹200-500" : "₹500-1,000"
      }],
      transportationTips: `Use local ${travelStyle === 'budget' ? 'public transport' : 'private cars'} for convenient travel`,
      culturalTips: "Respect local customs and traditions",
      estimatedDailyCost: travelStyle === 'budget' ? "₹2,000-3,500" : "₹4,500-7,000"
    })),
    
    recommendations: [
      {
        category: "Attraction",
        title: `${destination} Heritage Site`,
        description: "Must-visit landmark showcasing local culture",
        location: "City Center",
        rating: "4.5/5",
        priceRange: travelStyle === 'budget' ? "₹200-500" : "₹500-1,000",
        bestTimeToVisit: "Morning",
        duration: "2-3 hours"
      },
      {
        category: "Food",
        title: `Best ${foodPreference === 'Veg' ? 'Vegetarian' : 'Local'} Restaurant`,
        description: `Highly rated ${foodPreference === 'Veg' ? 'vegetarian' : 'local cuisine'} restaurant`,
        location: "Food District",
        rating: "4.7/5",
        priceRange: travelStyle === 'budget' ? "₹300-600" : "₹600-1,200",
        bestTimeToVisit: "Dinner",
        duration: "1-2 hours"
      }
    ],
    
    costBreakdown: {
      accommodation: travelStyle === 'budget' ? "₹2,000-4,000/night" : "₹5,000-10,000/night",
      food: travelStyle === 'budget' ? "₹1,000-2,000/day" : "₹2,500-4,000/day",
      transportation: "₹500-1,500/day",
      activities: travelStyle === 'budget' ? "₹1,000-2,500/day" : "₹2,500-5,000/day",
      shopping: "₹1,000-3,000 total",
      miscellaneous: "₹500-1,000/day",
      total: travelStyle === 'budget' ? `₹${days * 6000}-${days * 12000}` : `₹${days * 15000}-${days * 25000}`,
      dailyAverage: travelStyle === 'budget' ? "₹6,000-12,000" : "₹15,000-25,000"
    },
    
    travelTips: {
      transportation: ["Use local transport for authentic experience", "Book in advance for better rates"],
      moneySaving: ["Visit during off-peak hours", "Try street food", "Book accommodations early"],
      cultural: ["Dress modestly at religious sites", "Learn basic local greetings", "Respect photography rules"],
      weather: "Check local weather forecast and pack accordingly",
      packing: ["Comfortable walking shoes", "Sunscreen and sunglasses", "Portable charger", "Light clothing"]
    }
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body: FormData = await request.json();
    const { destination, duration } = body;

    // Validate required fields
    if (!destination || !duration) {
      return NextResponse.json({
        success: false,
        message: 'Destination and duration are required'
      }, { status: 400 });
    }

    // Check cache first
    const cacheKey = getCacheKey(body);
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('Returning cached result');
      return NextResponse.json({
        success: true,
        data: cached.data,
        cached: true
      });
    }

    // Check if Vertex AI is properly initialized
    if (!generativeModel) {
      console.warn('Vertex AI not initialized, using fallback');
      const fallbackData = generateFallbackItinerary(body);
      return NextResponse.json({
        success: true,
        data: fallbackData,
        fallback: true,
        message: 'AI service not available, showing sample itinerary'
      });
    }

    const prompt = generateDetailedPrompt(body);
    
    console.log('Generating itinerary for:', { 
      destination: body.destination, 
      duration: body.duration,
      style: body.travelStyle 
    });

    const result = await generativeModel.generateContent(prompt);
    const response = await result.response;
    
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error('No response generated from AI model');
    }

    const generatedText = response.candidates[0].content.parts[0].text;
    
    // Parse JSON response
    let itineraryData: ItineraryData;
    try {
      const cleanedText = generatedText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        itineraryData = JSON.parse(jsonMatch[0]) as ItineraryData;
      } else {
        throw new Error('No valid JSON found in AI response');
      }

      // Validate structure
      if (!itineraryData.destinationSummary || !itineraryData.dailyItineraries) {
        throw new Error('Invalid response structure from AI');
      }

    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      itineraryData = generateFallbackItinerary(body);
    }

    // Cache the result
    cache.set(cacheKey, {
      data: itineraryData,
      timestamp: Date.now()
    });

    // Clean up old cache entries
    Array.from(cache.entries()).forEach(([key, value]) => {
      if (Date.now() - value.timestamp > CACHE_TTL) {
        cache.delete(key);
      }
    });

    return NextResponse.json({
      success: true,
      data: itineraryData,
      cached: false
    });

  } catch (error) {
    console.error('Error generating itinerary:', error);
    
    // Return fallback response
    const fallbackData = generateFallbackItinerary({});
    
    return NextResponse.json({
      success: true,
      data: fallbackData,
      fallback: true,
      message: 'AI service temporarily unavailable, showing sample itinerary'
    });
  }
}