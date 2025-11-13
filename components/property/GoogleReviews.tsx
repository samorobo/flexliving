'use client';

import React, { useEffect, useState } from 'react';
import { Star, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { CardContent } from '@/components/ui/CardContent';
import { Skeleton } from '@/components/ui/Skeleton';
import Image from 'next/image';
import { GoogleReview } from '@/types';

interface GoogleReviewsProps {
  propertyId: string;
  propertyName: string;
  location: string;
  className?: string;
}

export const GoogleReviews: React.FC<GoogleReviewsProps> = ({
  propertyId,
  propertyName,
  location,
  className = '',
}) => {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoogleReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/reviews/google?query=${encodeURIComponent(propertyName + ' ' + location)}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch Google reviews');
        }

        const data = await response.json();
        if (data.success) {
          setReviews(data.data);
        }
      } catch (err) {
        console.error('Error fetching Google reviews:', err);
        setError('Could not load Google reviews at this time.');
      } finally {
        setLoading(false);
      }
    };

    fetchGoogleReviews();
  }, [propertyId, propertyName, location]);

  if (loading) {
    return (
      <div className={className}>
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <img 
            src="/google-logo.svg" 
            alt="Google" 
            className="h-5 w-5 mr-2"
          />
          Google Reviews
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <h3 className="text-xl font-semibold mb-4">Google Reviews</h3>
        <div className="text-sm text-slate-500">{error}</div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return null; // Don't show the section if no reviews
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold flex items-center">
          <img 
            src="/google-logo.svg" 
            alt="Google" 
            className="h-5 w-5 mr-2"
          />
          Google Reviews
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            // Open Google search for the property
            window.open(
              `https://www.google.com/search?q=${encodeURIComponent(propertyName + ' ' + location)}`, 
              '_blank'
            );
          }}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {reviews.slice(0, 3).map((review) => (
          <Card key={review.id} className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                {review.authorPhoto ? (
                  <div className="relative h-10 w-10">
                    <Image 
                      src={review.authorPhoto} 
                      alt={review.guestName}
                      fill
                      className="rounded-full object-cover"
                      sizes="40px"
                    />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    {review.guestName.charAt(0).toUpperCase()}
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{review.guestName}</h4>
                    <div className="flex items-center text-sm text-slate-500">
                      <MapPin className="w-3.5 h-3.5 mr-1" />
                      <span>Google</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-1 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(review.rating) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-slate-500 ml-2">
                      {review.relativeTime || 
                        new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-700 mt-1">
                    {review.comment}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
