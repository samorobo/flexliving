import { NextRequest, NextResponse } from 'next/server';
import { fetchGoogleReviews, findPlaceId } from '@/lib/services/googleReviews';
import { reviewStore } from '@/lib/reviewStore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('placeId');
    const query = searchParams.get('query');

    if (!placeId && !query) {
      return NextResponse.json(
        { success: false, error: 'Either placeId or query parameter is required' },
        { status: 400 }
      );
    }

    // If we have a query but no placeId, try to find the place ID
    const targetPlaceId = placeId || (query ? await findPlaceId(query) : null);
    
    if (!targetPlaceId) {
      return NextResponse.json(
        { success: false, error: 'Could not find place with the provided query' },
        { status: 404 }
      );
    }

    // Fetch reviews from Google Places API
    const googleReviews = await fetchGoogleReviews(targetPlaceId);

    if (!googleReviews) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch Google reviews' },
        { status: 500 }
      );
    }

    // Convert Google reviews to our normalized format
    const normalizedReviews = googleReviews.reviews.map(review => ({
      id: `google-${review.id}`,
      propertyId: targetPlaceId,
      propertyName: searchParams.get('propertyName') || 'Google Review',
      guestName: review.authorName,
      rating: review.rating,
      comment: review.text,
      date: new Date(review.time).toISOString(),
      type: 'google' as const,
      channel: 'google',
      categories: [],
      isApproved: true, // Auto-approve Google reviews
      isVisible: true,
      status: 'published',
      source: 'google' as const,
      authorPhoto: review.authorPhoto,
      relativeTime: review.relativeTime
    }));

   
    normalizedReviews.forEach(review => {
      
      reviewStore.addGoogleReview(review);
    });

    return NextResponse.json({
      success: true,
      data: normalizedReviews,
      meta: {
        total: normalizedReviews.length,
        averageRating: googleReviews.averageRating,
        totalRatings: googleReviews.totalRatings
      }
    });

  } catch (error: any) {
    console.error('Error in Google reviews API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
