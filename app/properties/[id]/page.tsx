'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PropertyHero } from '@/components/property/PropertyHero';
import { PropertyDetails } from '@/components/property/PropertyDetails';
import { ReviewsSection } from '@/components/property/ReviewsSection';
import { Property } from '@/types';
import propertiesData from '@/lib/data/properties.json';

export default function PropertyPage() {
  const params = useParams();
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    const foundProperty = propertiesData.find(p => p.id === params.id);
    setProperty(foundProperty || null);
  }, [params.id]);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading property...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PropertyHero property={property} />
        <PropertyDetails property={property} />
        <ReviewsSection propertyId={property.id} />
      </div>
    </div>
  );
}