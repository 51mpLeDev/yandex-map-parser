import type { ReviewData } from "./ReviewData.js";

export interface CompanyData {
    title: string;
    rating: number | null;
    ratings_count: number;
    reviews_count: number;
    reviews: ReviewData[];
}