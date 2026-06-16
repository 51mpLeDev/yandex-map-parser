export interface Review {
    id: number;
    external_id: string;
    author: string | null;
    rating: number | null;
    text: string | null;
    published_at: string | null;
}