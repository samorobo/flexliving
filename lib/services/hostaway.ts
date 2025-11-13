import { HostawayReview, NormalizedReview } from '@/types';

const HOSTAWAY_API_URL = 'https://api.hostaway.com/v1';
const ACCOUNT_ID = '61148';
const API_KEY = 'f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152';

export async function fetchHostawayReviews(): Promise<HostawayReview[]> {
  try {
    const response = await fetch(`${HOSTAWAY_API_URL}/reviews`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Cache-control': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`Hostaway API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result || [];
  } catch (error) {
    console.error('Error fetching Hostaway reviews:', error);
    // Fallback to mock data if API fails
    return require('@/lib/data/mock-reviews.json');
  }
}

export function normalizeReviews(reviews: HostawayReview[]): NormalizedReview[] {
  return reviews.map(review => {
    const rating = calculateAverageRating(review.reviewCategory || []);
    return {
      id: review.id.toString(),
      propertyId: review.listingId?.toString() || 'unknown',
      propertyName: review.listingName || 'Unknown Property',
      guestName: review.guestName || 'Anonymous Guest',
      rating: rating,
      comment: review.publicReview || '',
      date: new Date(review.submittedAt),
      type: review.type,
      channel: review.channelName || 'hostaway',
      categories: (review.reviewCategory || []).map(cat => ({
        category: cat.category,
        rating: cat.rating
      })),
      isApproved: review.isApproved,
      isVisible: review.isVisible,
      status: review.status,
      source: 'hostaway' as const
    };
  });
}

function calculateAverageRating(categories: { rating: number }[]): number {
  if (!categories.length) return 0;
  const sum = categories.reduce((acc, cat) => acc + (cat.rating || 0), 0);
  return Math.round((sum / categories.length) * 10) / 10;
}
