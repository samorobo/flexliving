import { NormalizedReview, GoogleReview } from '@/types';
import { normalizeReviews } from '@/lib/utils';
import mockReviews from '@/lib/data/mockReviews.json';

// In-memory store for reviews (simulates a database)
class ReviewStore {
  private reviews: Map<string | number, NormalizedReview>;
  private initialized: boolean = false;
  private googleReviews: Map<string, NormalizedReview> = new Map();

  constructor() {
    this.reviews = new Map();
  }

  initialize() {
    if (this.initialized) return;
    
    // Type assertion for mock data
    const mockData = mockReviews as unknown as { result: Array<{
      id: number;
      type: 'guest-to-host' | 'host-to-guess' | 'google';
      status: string;
      rating: number;
      publicReview: string;
      reviewCategory: Array<{ category: string; rating: number }>;
      submittedAt: string;
      guestName: string;
      listingName: string;
      channelName: string;
      isApproved: boolean;
      isVisible: boolean;
    }> };

    const normalized = normalizeReviews(mockData.result);
    normalized.forEach(review => {
      this.reviews.set(review.id, review as NormalizedReview);
    });
    
    this.initialized = true;
    console.log('Review store initialized with', this.reviews.size, 'reviews');
  }

  getAll(): NormalizedReview[] {
    this.initialize();
    return Array.from(this.reviews.values());
  }

  getById(id: string | number): NormalizedReview | undefined {
    this.initialize();
    const review = this.reviews.get(id) || this.googleReviews.get(String(id));
    return review;
  }

  update(id: string | number, data: Partial<NormalizedReview>): NormalizedReview | null {
    this.initialize();
    const review = this.reviews.get(id) || this.googleReviews.get(String(id));
    
    if (!review) return null;
    
    const updated = { ...review, ...data };
    
    if (review.source === 'google') {
      this.googleReviews.set(String(id), updated as NormalizedReview);
    } else {
      this.reviews.set(id as number, updated as NormalizedReview);
    }
    
    return updated;
  }

  addGoogleReview(review: NormalizedReview) {
    this.googleReviews.set(String(review.id), review);
  }

  getPublic(propertyId?: string): NormalizedReview[] {
    this.initialize();
    
    // Combine both Hostaway and Google reviews
    const allReviews = [
      ...Array.from(this.reviews.values()),
      ...Array.from(this.googleReviews.values())
    ];

    let filteredReviews = allReviews.filter(
      r => r.isApproved && (r.isVisible ?? true) // Default to true if not set
    );

    if (propertyId) {
      filteredReviews = filteredReviews.filter(r => r.propertyId === propertyId);
    }

    return filteredReviews.sort((a, b) => {
      const dateA = typeof a.date === 'string' ? new Date(a.date) : new Date(a.date);
      const dateB = typeof b.date === 'string' ? new Date(b.date) : new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  }

  // Get reviews grouped by property
  getReviewsByProperty() {
    const reviews = this.getAll();
    const byProperty: Record<string, NormalizedReview[]> = {};
    
    reviews.forEach(review => {
      if (!byProperty[review.propertyId]) {
        byProperty[review.propertyId] = [];
      }
      byProperty[review.propertyId].push(review);
    });
    
    return byProperty;
  }
}

// Export singleton instance
export const reviewStore = new ReviewStore();