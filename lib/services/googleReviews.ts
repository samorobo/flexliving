import { GoogleReview } from '@/types';

const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface GooglePlacesReview {
  author_name: string;
  author_url?: string;
  language: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface GooglePlacesResponse {
  result?: {
    reviews?: GooglePlacesReview[];
    rating?: number;
    user_ratings_total?: number;
  };
  status: string;
  error_message?: string;
}

export async function fetchGoogleReviews(placeId: string): Promise<{
  reviews: GoogleReview[];
  averageRating: number;
  totalRatings: number;
} | null> {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn('Google Places API key not configured');
    return null;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?` +
      `place_id=${encodeURIComponent(placeId)}` +
      `&fields=name,rating,user_ratings_total,reviews` +
      `&key=${GOOGLE_PLACES_API_KEY}`
    );

    const data: GooglePlacesResponse = await response.json();

    if (data.status !== 'OK' || !data.result) {
      console.error('Google Places API error:', data.status);
      return null;
    }

    const reviews = (data.result.reviews || []).map(review => {
      const reviewData: GoogleReview = {
        id: `google-${review.time}-${review.author_name.substring(0, 10).toLowerCase().replace(/\s+/g, '-')}`,
        authorName: review.author_name,
        authorPhoto: review.profile_photo_url,
        rating: review.rating,
        text: review.text,
        time: review.time * 1000, // Convert to milliseconds
        relativeTime: review.relative_time_description,
        language: review.language,
        source: 'google',
        url: review.author_url,
        isApproved: true,
        isVisible: true,
        status: 'published',
        propertyId: placeId,
        propertyName: 'Google Review',
        guestName: review.author_name,
        comment: review.text,
        date: new Date(review.time * 1000).toISOString(),
        type: 'google',
        channel: 'google',
        categories: []
      };
      return reviewData;
    });

    return {
      reviews,
      averageRating: data.result.rating || 0,
      totalRatings: data.result.user_ratings_total || 0,
    };
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return null;
  }
}

// Helper function to get place ID from address or coordinates
export async function findPlaceId(query: string): Promise<string | null> {
  if (!GOOGLE_PLACES_API_KEY) return null;

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?` +
      `input=${encodeURIComponent(query)}` +
      `&inputtype=textquery&fields=place_id` +
      `&key=${GOOGLE_PLACES_API_KEY}`
    );

    const data = await response.json();
    return data.candidates?.[0]?.place_id || null;
  } catch (error) {
    console.error('Error finding place:', error);
    return null;
  }
}
