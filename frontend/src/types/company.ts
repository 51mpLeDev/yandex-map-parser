export interface Company {
    id: number;
    url: string;
    title: string | null;
    rating: number | null;
    ratings_count: number;
    reviews_count: number;
    status: "pending" | "processing" | "completed" | "failed";
    last_error: string | null;
    last_parsed_at: string | null;
}