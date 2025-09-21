// types/trip.ts
export interface FormData {
  travelStyle: 'budget' | 'luxury' | '';
  pickupLocation: string;
  destination: string;
  date: string;
  duration: string;
  groupType: 'Solo' | 'Couple' | 'Family' | '';
  foodPreference: 'Any' | 'Veg' | 'Non-Veg' | '';
  travelInterests: string[];
}

export interface Activity {
  activity: string;
  description: string;
  location: string;
  duration: string;
  cost: string;
}

export interface FoodRecommendation {
  name: string;
  type: string;
  speciality: string;
  priceRange: string;
}

export interface DailyItinerary {
  day: number;
  title: string;
  date?: string;
  morning: Activity;
  afternoon: Activity;
  evening?: Activity;
  foodRecommendations: FoodRecommendation[];
  transportationTips: string;
  culturalTips: string;
  estimatedDailyCost: string;
}

export interface Recommendation {
  category: string;
  title: string;
  description: string;
  location: string;
  rating: string;
  priceRange: string;
  bestTimeToVisit: string;
  duration: string;
}

export interface CostBreakdown {
  accommodation: string;
  food: string;
  transportation: string;
  activities: string;
  shopping: string;
  miscellaneous: string;
  total: string;
  dailyAverage: string;
}

export interface TravelTips {
  transportation: string[];
  moneySaving: string[];
  cultural: string[];
  weather: string;
  packing: string[];
}

export interface ItineraryData {
  destinationSummary: string;
  dailyItineraries: DailyItinerary[];
  recommendations: Recommendation[];
  costBreakdown: CostBreakdown;
  travelTips: TravelTips;
}

export interface ApiResponse {
  success: boolean;
  data?: ItineraryData;
  cached?: boolean;
  fallback?: boolean;
  message?: string;
  error?: string;
}