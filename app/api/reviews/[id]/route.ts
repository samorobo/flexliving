import { NextRequest, NextResponse } from 'next/server';
import { reviewStore } from '@/lib/reviewStore';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const body = await request.json();
    const reviewId = parseInt(context.params.id);

    const updatedReview = reviewStore.update(reviewId, body);

    if (!updatedReview) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedReview,
      message: 'Review updated successfully'
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  const { params } = context;
  try {
    const reviewId = parseInt(params.id);
    const review = reviewStore.getById(reviewId);

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: review
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error fetching review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch review' },
      { status: 500 }
    );
  }
}