'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Share2, Heart } from 'lucide-react';
import { Property } from '@/types';
import { Button } from '@/components/ui/Button';

interface PropertyHeroProps {
  property: Property;
}

export const PropertyHero: React.FC<PropertyHeroProps> = ({ property }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="relative">
      {/* Image Gallery */}
      <div className="relative h-[500px] bg-slate-900 overflow-hidden rounded-2xl">
        <img
          src={property.images[currentImage]}
          alt={property.name}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            >
              <ChevronLeft className="w-6 h-6 text-slate-900" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            >
              <ChevronRight className="w-6 h-6 text-slate-900" />
            </button>
          </>
        )}

        {/* Image Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {property.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImage ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button variant="secondary" size="sm" className="bg-white/90 backdrop-blur-sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="secondary" size="sm" className="bg-white/90 backdrop-blur-sm">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Property Info */}
      <div className="mt-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              {property.title}
            </h1>
            <div className="flex items-center text-slate-600">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="text-lg">{property.location}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-slate-900">
              £{property.price}
            </div>
            <div className="text-slate-600">per night</div>
          </div>
        </div>
      </div>
    </div>
  );
};