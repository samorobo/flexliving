import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
//import { Review, NormalizedReview, ReviewCategory } from '@/types';

import {Review, NormalizedReview, ReviewCategory} from '../types/index';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateAverageRating(categories: ReviewCategory[]): number {
  if (!categories || categories.length === 0) return 0;
  const sum = categories.reduce((acc, cat) => acc + cat.rating, 0);
  return Math.round((sum / categories.length) * 10) / 10;
}

export function normalizeReviews(reviews: Review[]): NormalizedReview[] {
  return reviews.map(review => {
    const avgRating = review.rating ?? calculateAverageRating(review.reviewCategory);
    const propertySlug = review.listingName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return {
      id: review.id,
      propertyName: review.listingName,
      propertyId: propertySlug,
      guestName: review.guestName,
      rating: avgRating,
      comment: review.publicReview,
      date: new Date(review.submittedAt),
      type: review.type,
      channel: review.channelName || 'Direct',
      categories: review.reviewCategory || [],
      isApproved: review.isApproved || false,
      isVisible: review.isVisible || false,
      status: review.status
    };
  });
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getRatingColor(rating: number): string {
  if (rating >= 9) return 'text-green-600 bg-green-50';
  if (rating >= 7) return 'text-blue-600 bg-blue-50';
  if (rating >= 5) return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
}

export function getChannelColor(channel: string): string {
  const colors: Record<string, string> = {
    'Airbnb': 'bg-[#FF5A5F] text-white',
    'Booking.com': 'bg-[#003580] text-white',
    'Vrbo': 'bg-[#0D3DB8] text-white',
    'Direct': 'bg-slate-700 text-white',
    'Expedia': 'bg-[#FFCB0E] text-slate-900'
  };
  return colors[channel] || 'bg-slate-500 text-white';
}