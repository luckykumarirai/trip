'use client'

import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Utensils, 
  Camera, 
  Mountain, 
  Heart, 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  Star, 
  Clock, 
  DollarSign, 
  Sparkles, 
  Brain, 
  MapIcon, 
  Coffee 
} from 'lucide-react';
import { FormData, ItineraryData, ApiResponse } from '@/types/trip';

const AITripPlanner: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiItinerary, setAiItinerary] = useState<ItineraryData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    travelStyle: '',
    pickupLocation: '',
    destination: '',
    date: '',
    duration: '',
    groupType: '',
    foodPreference: '',
    travelInterests: []
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      travelInterests: prev.travelInterests.includes(interest)
        ? prev.travelInterests.filter(i => i !== interest)
        : [...prev.travelInterests, interest]
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Generate AI-powered itinerary
  const generateItinerary = async (): Promise<void> => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result: ApiResponse = await response.json();
      
      if (result.success && result.data) {
        setAiItinerary(result.data);
        setCurrentStep(4);
      } else {
        console.error('Failed to generate itinerary:', result.message);
        setCurrentStep(4);
      }
    } catch (error) {
      console.error('Error generating itinerary:', error);
      setCurrentStep(4);
    } finally {
      setIsGenerating(false);
    }
  };

  // Step 1: Travel Style Selection
  const TravelStyleStep: React.FC = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <Brain className="w-12 h-12 text-orange-500 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">How you want to travel?</h2>
        <p className="text-sm text-gray-600">Our AI will personalize your entire experience</p>
      </div>
      
      <div className="space-y-4">
        <div 
          className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
            formData.travelStyle === 'budget' 
              ? 'border-orange-500 bg-orange-50 shadow-md' 
              : 'border-gray-200 hover:border-orange-300 hover:shadow-sm'
          }`}
          onClick={() => updateFormData('travelStyle', 'budget')}
        >
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-3">💰</span>
            <span className="font-semibold text-lg">Budget-Friendly</span>
            {formData.travelStyle === 'budget' && <Sparkles className="w-5 h-5 text-orange-500 ml-auto" />}
          </div>
          <p className="text-gray-600">Smart savings, authentic local experiences</p>
          <p className="text-xs text-orange-600 mt-2">AI optimizes for best value experiences</p>
        </div>

        <div 
          className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
            formData.travelStyle === 'luxury' 
              ? 'border-orange-500 bg-orange-50 shadow-md' 
              : 'border-gray-200 hover:border-orange-300 hover:shadow-sm'
          }`}
          onClick={() => updateFormData('travelStyle', 'luxury')}
        >
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-3">✨</span>
            <span className="font-semibold text-lg">Luxury/Comfort</span>
            {formData.travelStyle === 'luxury' && <Sparkles className="w-5 h-5 text-orange-500 ml-auto" />}
          </div>
          <p className="text-gray-600">Premium accommodations, curated experiences</p>
          <p className="text-xs text-orange-600 mt-2">AI selects finest venues and services</p>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button className="px-6 py-2 text-gray-600 hover:text-gray-800">Skip</button>
        <button 
          onClick={nextStep}
          disabled={!formData.travelStyle}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );

  // Step 2: Trip Details
  const TripDetailsStep: React.FC = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <MapIcon className="w-12 h-12 text-orange-500 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Tell us about your trip</h2>
        <p className="text-sm text-gray-600">AI will analyze your destination for optimal planning</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Mumbai (optional)"
              value={formData.pickupLocation}
              onChange={(e) => updateFormData('pickupLocation', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
              autoComplete="address-line1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Goa"
              value={formData.destination}
              onChange={(e) => updateFormData('destination', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
              autoComplete="address-line2"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">AI will research local attractions and hidden gems</p>
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => updateFormData('date', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
              />
            </div>
          </div>
          <div className="w-20">
            <label className="block text-sm font-medium text-gray-700 mb-2">Days</label>
            <input
              type="number"
              placeholder="3"
              min="1"
              max="30"
              value={formData.duration}
              onChange={(e) => updateFormData('duration', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-center bg-white text-gray-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Group Type</label>
          <div className="flex space-x-3">
            {(['Solo', 'Couple', 'Family'] as const).map((type) => (
              <button
                key={type}
                onClick={() => updateFormData('groupType', type)}
                className={`flex-1 py-3 px-4 rounded-lg border transition-all ${
                  formData.groupType === type
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                }`}
              >
                <Users className="w-4 h-4 mx-auto mb-1" />
                {type}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">AI will optimize group activities and accommodations</p>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={prevStep} className="px-6 py-2 text-gray-600 hover:text-gray-800 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <button 
          onClick={nextStep}
          disabled={!formData.destination}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );

  // Step 3: Interests & Preferences
  const InterestsStep: React.FC = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <Heart className="w-12 h-12 text-orange-500 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Tell us about interests</h2>
        <p className="text-sm text-gray-600">AI will curate experiences matching your preferences</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Food preference</label>
          <div className="flex space-x-3">
            {(['Any', 'Veg', 'Non-Veg'] as const).map((pref) => (
              <button
                key={pref}
                onClick={() => updateFormData('foodPreference', pref)}
                className={`flex-1 py-3 px-4 rounded-lg border transition-all ${
                  formData.foodPreference === pref
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                }`}
              >
                <Utensils className="w-4 h-4 mx-auto mb-1" />
                {pref}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">AI will find restaurants matching your dietary needs</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Travel interests</label>
          <div className="space-y-3">
            {[
              { id: 'sightseeing', label: 'Sightseeing', icon: Camera, desc: 'Historic sites & landmarks' },
              { id: 'food-culture', label: 'Food & Culture', icon: Coffee, desc: 'Local cuisine & traditions' },
              { id: 'adventure', label: 'Adventure', icon: Mountain, desc: 'Outdoor activities & sports' }
            ].map(({ id, label, icon: Icon, desc }) => (
              <button
                key={id}
                onClick={() => toggleInterest(id)}
                className={`w-full flex items-center justify-between py-4 px-4 rounded-lg border transition-all ${
                  formData.travelInterests.includes(id)
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                }`}
              >
                <div className="flex items-center">
                  <Icon className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">{label}</div>
                    <div className="text-xs opacity-75">{desc}</div>
                  </div>
                </div>
                {formData.travelInterests.includes(id) && <Sparkles className="w-5 h-5" />}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">AI will prioritize activities based on your interests</p>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={prevStep} className="px-6 py-2 text-gray-600 hover:text-gray-800 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <button 
          onClick={generateItinerary}
          disabled={isGenerating}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              AI Generating...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              Generate AI Trip Plan
            </>
          )}
        </button>
      </div>
    </div>
  );

  // Step 4: AI-Generated Itinerary
  const ItineraryStep: React.FC = () => (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-orange-500 mr-2" />
          <h2 className="text-3xl font-bold text-gray-800">
            Your AI-Generated Trip to {formData.destination || 'Goa'} is Ready!
          </h2>
        </div>
        {aiItinerary?.destinationSummary && (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg max-w-4xl mx-auto">
            <p className="text-gray-700 text-lg leading-relaxed">
              <Brain className="w-5 h-5 inline text-orange-500 mr-2" />
              {aiItinerary.destinationSummary}
            </p>
          </div>
        )}
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main AI Itinerary */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Calendar className="w-6 h-6 text-orange-500 mr-2" />
            AI-Curated Daily Itinerary
          </h3>
          
          {aiItinerary?.dailyItineraries?.map((day, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{day.title}</h3>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  Day {day.day}
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">Morning: {day.morning.activity}</h4>
                    <p className="text-sm text-gray-600 mb-1">{day.morning.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">📍 {day.morning.location}</span>
                      <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded">⏰ {day.morning.duration}</span>
                      <span className="text-green-600 bg-green-50 px-2 py-1 rounded">💰 {day.morning.cost}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">Afternoon: {day.afternoon.activity}</h4>
                    <p className="text-sm text-gray-600 mb-1">{day.afternoon.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">📍 {day.afternoon.location}</span>
                      <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded">⏰ {day.afternoon.duration}</span>
                      <span className="text-green-600 bg-green-50 px-2 py-1 rounded">💰 {day.afternoon.cost}</span>
                    </div>
                  </div>
                </div>

                {day.evening && (
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">Evening: {day.evening.activity}</h4>
                      <p className="text-sm text-gray-600 mb-1">{day.evening.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">📍 {day.evening.location}</span>
                        <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded">⏰ {day.evening.duration}</span>
                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded">💰 {day.evening.cost}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4 mt-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                      <Utensils className="w-4 h-4 mr-2 text-orange-500" />
                      AI Food Recommendations
                    </h5>
                    {day.foodRecommendations.map((food, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-medium">{food.name}</span> - {food.speciality}
                        <div className="text-xs text-gray-600">{food.type} • {food.priceRange}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center text-sm mt-3 pt-3 border-t">
                    <span className="text-gray-600">Daily Cost Estimate:</span>
                    <span className="font-bold text-gray-900 text-lg">{day.estimatedDailyCost}</span>
                  </div>
                </div>
              </div>
            </div>
          )) || (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          )}
        </div>

        {/* AI Recommendations Sidebar */}
        <div className="space-y-6">
          {aiItinerary?.recommendations && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Brain className="w-5 h-5 text-orange-500 mr-2" />
                AI Smart Recommendations
              </h3>
              <div className="space-y-4">
                {aiItinerary.recommendations.slice(0, 4).map((rec, index) => (
                  <div key={index} className="border-l-4 border-orange-500 pl-4 bg-orange-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-gray-800 text-sm">{rec.title}</h4>
                      <span className="text-xs text-orange-600 bg-orange-200 px-2 py-1 rounded">{rec.category}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-blue-600">📍 {rec.location}</span>
                      {rec.rating && (
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-gray-600 ml-1">{rec.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {aiItinerary?.costBreakdown && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 text-green-500 mr-2" />
                AI Cost Analysis
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-600">🏨 Accommodation:</span>
                  <span className="font-medium">{aiItinerary.costBreakdown.accommodation}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-600">🍽️ Food:</span>
                  <span className="font-medium">{aiItinerary.costBreakdown.food}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-600">🚗 Transportation:</span>
                  <span className="font-medium">{aiItinerary.costBreakdown.transportation}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-600">🎯 Activities:</span>
                  <span className="font-medium">{aiItinerary.costBreakdown.activities}</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between font-bold text-lg bg-orange-100 p-3 rounded">
                  <span>💼 Total Trip Cost:</span>
                  <span className="text-orange-600">{aiItinerary.costBreakdown.total}</span>
                </div>
              </div>
            </div>
          )}

          <button className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 font-medium shadow-lg transition-all transform hover:scale-105">
            🚀 Book All in One Click
          </button>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button 
          onClick={() => {
            setCurrentStep(1);
            setAiItinerary(null);
            setFormData({
              travelStyle: '',
              pickupLocation: '',
              destination: '',
              date: '',
              duration: '',
              groupType: '',
              foodPreference: '',
              travelInterests: []
            });
          }}
          className="px-6 py-2 text-gray-600 hover:text-gray-800 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Plan Another AI Trip
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Brain className="w-8 h-8 text-orange-500 mr-3" />
              <h1 className="text-xl font-bold">
                <span className="text-orange-500">EaseMyTrip</span>
                <span className="text-gray-700"> AI Planner</span>
              </h1>
              <span className="ml-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                ✨ Powered by Vertex AI
              </span>
            </div>
            <div className="flex space-x-4">
              <button className="text-gray-600 hover:text-gray-900">How AI Works</button>
              <button className="text-gray-600 hover:text-gray-900">Open App</button>
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 shadow-md">
                Try AI Demo
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentStep === 4 ? (
          <ItineraryStep />
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Side Info */}
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                AI-Powered Travel Planning — 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                  Smart & Personalized
                </span>
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Our advanced Vertex AI integration creates detailed, personalized itineraries that adapt to your preferences. 
                Get real-time recommendations, intelligent cost optimization, and local insights powered by Google Cloud AI.
              </p>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 text-orange-500 mr-2" />
                  AI-Powered Features
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Brain className="w-4 h-4 text-blue-500 mr-2" />
                    Smart destination analysis
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-green-500 mr-2" />
                    Optimized daily scheduling
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-2" />
                    Personalized recommendations
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-red-500 mr-2" />
                    Intelligent cost optimization
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Form */}
            <div className="lg:w-1/2">
              <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-100">
                {/* Progress Indicator */}
                <div className="flex justify-center mb-8">
                  <div className="flex space-x-3">
                    {[
                      { step: 1, icon: Brain, label: 'Style' },
                      { step: 2, icon: MapIcon, label: 'Details' },
                      { step: 3, icon: Heart, label: 'Interests' },
                      { step: 4, icon: Sparkles, label: 'AI Results' }
                    ].map(({ step, icon: Icon, label }) => (
                      <div key={step} className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          step <= currentStep 
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-xs mt-1 ${step <= currentStep ? 'text-orange-600 font-medium' : 'text-gray-400'}`}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Steps */}
                {currentStep === 1 && <TravelStyleStep />}
                {currentStep === 2 && <TripDetailsStep />}
                {currentStep === 3 && <InterestsStep />}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md mx-4">
            <div className="text-center">
              <Brain className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">AI is crafting your perfect trip...</h3>
              <p className="text-gray-600 mb-4">Analyzing destination data, optimizing routes, and personalizing recommendations</p>
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                <span className="text-sm text-gray-500">This may take a few moments</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AITripPlanner;