'use client';

import React, { useEffect, useState } from 'react';
import { Search, MapPin, SlidersHorizontal, Sparkles } from 'lucide-react';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Button } from '@/components/ui/Button';
import { Property, NormalizedReview } from '@/types';
import propertiesData from '@/lib/data/properties.json';

export default function HomePage() {
  const [properties] = useState<Property[]>(propertiesData);
  const [reviews, setReviews] = useState<NormalizedReview[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews/public');
      const data = await response.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const getPropertyReviews = (propertyId: string) => {
    return reviews.filter(r => r.propertyId === propertyId);
  };

  const getAverageRating = (propertyId: string) => {
    const propertyReviews = getPropertyReviews(propertyId);
    if (propertyReviews.length === 0) return 0;
    const sum = propertyReviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / propertyReviews.length;
  };

  const locations = ['all', ...new Set(properties.map(p => p.location))];

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || property.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen">
      
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Premium Flexible Living</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Perfect
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Flexible Home
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Discover premium short-term and flexible living spaces across London.
              Modern apartments designed for your lifestyle.
            </p>

            
            <div className="bg-white rounded-2xl shadow-2xl p-2 max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by location, property name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="px-4 py-3 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {locations.map(location => (
                      <option key={location} value={location}>
                        {location === 'all' ? 'All Locations' : location}
                      </option>
                    ))}
                  </select>
                  <Button variant="primary" size="lg" className="whitespace-nowrap">
                    <Search className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Available Properties
            </h2>
            <p className="text-slate-600 mt-1">
              {filteredProperties.length} properties found
            </p>
          </div>
          <Button variant="outline">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="text-center py-16">
            <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No properties found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                averageRating={getAverageRating(property.id)}
                reviewCount={getPropertyReviews(property.id).length}
              />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Why Choose The Flex?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Experience the perfect blend of comfort, flexibility, and convenience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Flexible Terms',
                description: 'From one night to several months, choose the duration that fits your needs',
                icon: '🔄'
              },
              {
                title: 'Prime Locations',
                description: 'All properties in central London with excellent transport links',
                icon: '📍'
              },
              {
                title: 'Fully Equipped',
                description: 'Modern amenities and everything you need for comfortable living',
                icon: '✨'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-8 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Find Your Perfect Space?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Browse our collection of premium properties or contact us for personalized recommendations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              View All Properties
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white/10">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}