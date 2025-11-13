export interface HostawayReview {
    id: number;
    type: 'guest-to-host' | 'host-to-guest';
    status: 'published' | 'pending' | 'rejected';
    rating: number | null;
    publicReview: string;
    reviewCategory: ReviewCategory[];
    submittedAt: string;
    guestName: string;
    listingName: string;
    channelName?: string;
    isApproved: boolean;
    isVisible: boolean;
    listingId?: number;
}

export interface Review extends Omit<HostawayReview, 'id' | 'type'> {
    id: number;
    type: 'guest-to-host' | 'host-to-guest' | 'google';
    status: 'published' | 'pending' | 'rejected';
    rating: number | null;
    publicReview: string;
    reviewCategory: ReviewCategory[];
    submittedAt: string; 
    guestName: string;
    listingName: string;
    channelName?: string;
    isApproved: boolean;
    isVisible: boolean;
    source?: 'hostaway' | 'google';
}

export interface GoogleReview {
    id: string;
    authorName: string;
    authorPhoto?: string;
    rating: number;
    text: string;
    time: number;
    relativeTime: string;
    language: string;
    url?: string;
    source: 'google';
    isApproved: boolean;
    isVisible: boolean;
    status: string;
    propertyId: string;
    propertyName: string;
    guestName: string;
    comment: string;
    date: string | number | Date;
    type: 'google' | 'guest-to-host' | 'host-to-guest';
    channel: string;
    categories: Array<{ category: string; rating: number }>;
}

export interface ReviewCategory{
    category: string;
    rating: number;
}

export interface NormalizedReview {
    id: number | string;
    propertyName: string;
    propertyId: string;
    guestName: string;
    rating: number;
    comment: string;
    date: Date | string | number;
    type: 'guest-to-host' | 'host-to-guest' | 'google';
    channel: string;
    categories: ReviewCategory[];
    isApproved: boolean;
    isVisible: boolean;
    status: string;
    source?: 'hostaway' | 'google';
    authorPhoto?: string;
    relativeTime?: string;
}

export interface Property {
    id: string;
    name: string;
    slug: string;
    title: string;
    description: string;
    location: string;
    bedrooms: number;
    bathrooms: number;
    guests: number;
    price: number;
    currency: string;
    images: string[];
    amenities: string[];
    coordinates: {
        lat: number;
        lng: number;
    };
}


export interface DashboardStats {
    totalReviews: number;
    averageRating: number;
    pendingApproval: number;
    byChannel: Record<string, number>;
    byProperty: Record<string, number>;
    ratingDistribution: Record<number, number>;
}

export interface FilterState {
    property: string;
    rating: number[];
    channel: string[];
    dateRange: string;
    status: string;
    searchQuery: string;
}