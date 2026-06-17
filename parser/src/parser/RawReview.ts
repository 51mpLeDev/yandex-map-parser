export interface RawReview {
    reviewId: string;

    author?: {
        name?: string;
    };

    rating?: number;

    text?: string;

    updatedTime?: string;
}

export interface FetchReviewsParams {
    offset: number;
    limit: number;
    count: number;
    loadedReviewsCount: number;
    page: number;
    totalPages: number;
    reviewsRemained: number;
}

export interface FetchReviewsResponse {
    data?: {
        reviews?: RawReview[];
        params?: FetchReviewsParams;
    };

    result?: {
        reviews?: RawReview[];
    };

    reviews?: RawReview[];
}