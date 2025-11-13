'use client';

import React, { useEffect, useState } from 'react';
import { Star, ThumbsUp, Calendar, User } from 'lucide-react';
import { NormalizedReview } from '@/types';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate, getInitials, getRatingColor } from '@/lib/utils';

interface ReviewsSectionProps {
  propertyId: string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ propertyId }) => {
  const [reviews, setReviews] = useState<NormalizedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [propertyId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/public?property=${propertyId}`);
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.data);
        setAverageRating(data.meta.averageRating);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-12">
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-slate-600">Loading reviews...</p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="mt-12">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-slate-900">Guest Reviews</h2>
          </CardHeader>
          <CardBody>
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No reviews yet. Be the first to review!</p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Guest Reviews</h2>
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold text-slate-900">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-slate-600">({reviews.length} reviews)</span>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {/* Rating Categories */}
          {reviews[0]?.categories && reviews[0].categories.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-slate-200">
              {reviews[0].categories.map((category, index) => {
                const avgCategoryRating =
                  reviews.reduce((sum, review) => {
                    const cat = review.categories.find(c => c.category === category.category);
                    return sum + (cat?.rating || 0);
                  }, 0) / reviews.length;

                return (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-slate-900">
                      {avgCategoryRating.toFixed(1)}
                    </div>
                    <div className="text-sm text-slate-600 capitalize">
                      {category.category.replace(/_/g, ' ')}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-slate-200 last:border-0 pb-6 last:pb-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {getInitials(review.guestName)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{review.guestName}</div>
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(review.date)}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getRatingColor(review.rating)}>
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {review.rating.toFixed(1)}
                  </Badge>
                </div>

                <p className="text-slate-700 leading-relaxed">{review.comment}</p>

                {/* Channel Badge */}
                <div className="mt-3">
                  <Badge variant="default" className="text-xs">
                    Via {review.channel}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};