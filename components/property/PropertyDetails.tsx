import React from 'react';
import { Wifi, Tv, Wind, Dumbbell, Car, Users, Bed, Bath, Home } from 'lucide-react';
import { Property } from '@/types';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';

interface PropertyDetailsProps {
  property: Property;
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  const amenityIcons: Record<string, any> = {
    'WiFi': Wifi,
    'TV': Tv,
    'Kitchen': Home,
    'Washer': Wind,
    'Gym': Dumbbell,
    'Parking': Car,
    'Concierge': Users,
    'Pool': Users,
    'Rooftop': Home,
    'Heating': Wind,
    'Kitchenette': Home,
    'Desk': Home,
    'Garden': Home
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-8">
        {/* About */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-slate-900">About this property</h2>
          </CardHeader>
          <CardBody>
            <p className="text-slate-700 leading-relaxed">{property.description}</p>
          </CardBody>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-slate-900">Property Features</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Bed className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">
                    {property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} Bedroom${property.bedrooms > 1 ? 's' : ''}`}
                  </div>
                  <div className="text-sm text-slate-600">Sleeping space</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Bath className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">
                    {property.bathrooms} Bathroom{property.bathrooms > 1 ? 's' : ''}
                  </div>
                  <div className="text-sm text-slate-600">Private</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">
                    Up to {property.guests} Guests
                  </div>
                  <div className="text-sm text-slate-600">Maximum capacity</div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-slate-900">Amenities</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.amenities.map((amenity, index) => {
                const Icon = amenityIcons[amenity] || Home;
                return (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                    <Icon className="w-5 h-5 text-slate-600" />
                    <span className="text-slate-900">{amenity}</span>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-slate-900">Location</h2>
          </CardHeader>
          <CardBody>
            <div className="aspect-video bg-slate-200 rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${property.coordinates.lat},${property.coordinates.lng}&zoom=14`}
                allowFullScreen
              />
            </div>
            <p className="mt-4 text-slate-700">{property.location}</p>
          </CardBody>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <h3 className="text-xl font-bold text-slate-900">Book Your Stay</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Check-in Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Check-out Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Number of Guests
              </label>
              <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                {[...Array(property.guests)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1} Guest{i > 0 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-700">£{property.price} × 3 nights</span>
                <span className="font-semibold">£{property.price * 3}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-700">Service fee</span>
                <span className="font-semibold">£{Math.round(property.price * 0.1)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-lg font-bold text-slate-900">
                  £{property.price * 3 + Math.round(property.price * 0.1)}
                </span>
              </div>
            </div>

            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
              Request to Book
            </button>

            <p className="text-center text-sm text-slate-600">
              You won't be charged yet
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};