import { NextRequest, NextResponse } from 'next/server';
import { reviewStore } from '@/lib/reviewStore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('property');

    const publicReviews = reviewStore.getPublic(propertyId || undefined);

    return NextResponse.json({
      success: true,
      data: publicReviews,
      meta: {
        total: publicReviews.length,
        averageRating: publicReviews.length > 0 
          ? publicReviews.reduce((acc, r) => acc + r.rating, 0) / publicReviews.length 
          : 0
      }
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error fetching public reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}