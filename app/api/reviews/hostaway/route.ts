import { NextRequest, NextResponse } from 'next/server';
import { reviewStore } from '@/lib/reviewStore';

export async function GET(request: NextRequest) {
  try {
    const reviews = reviewStore.getAll();

    const meta = {
      total: reviews.length,
      averageRating: reviews.length > 0 
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
        : 0,
      pending: reviews.filter(r => !r.isApproved).length,
      approved: reviews.filter(r => r.isApproved).length,
      channels: [...new Set(reviews.map(r => r.channel))],
      properties: [...new Set(reviews.map(r => r.propertyName))]
    };

    return NextResponse.json({
      success: true,
      data: reviews,
      meta
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}