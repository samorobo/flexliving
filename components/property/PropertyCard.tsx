import React from 'react';
import Link from 'next/link';
import { MapPin, Bed, Bath, Users, Star, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Property } from '@/types';
import Image from 'next/image';

interface PropertyCardProps {
  property: Property;
  averageRating?: number;
  reviewCount?: number;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, averageRating, reviewCount }) => {
  return (
    <Link href={`/properties/${property.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
        {/* Image with Rating Badge */}
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={property.images[0]}
            alt={property.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
          {averageRating && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1 shadow-md">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-sm text-gray-800">{averageRating.toFixed(1)}</span>
              <span className="text-xs text-gray-500">({reviewCount})</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Location and Price */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
              <span>{property.location}</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">£{property.price}</span>
              <span className="text-sm text-gray-500"> / night</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 h-12">
            {property.title}
          </h3>

          {/* Features */}
          <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600 border-b border-gray-100 pb-4">
            <div className="flex items-center space-x-1">
              <Bed className="w-4 h-4 text-gray-400" />
              <span>{property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} bed`}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bath className="w-4 h-4 text-gray-400" />
              <span>{property.bathrooms} bath</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-gray-400" />
              <span>{property.guests} guests</span>
            </div>
          </div>

          {/* View Button */}
          <div className="flex justify-between items-center">
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center group">
              View details
              <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <div className="text-xs text-gray-500">
              {property.amenities.slice(0, 2).join(' • ')}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}