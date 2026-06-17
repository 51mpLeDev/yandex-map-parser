import { APIRequestContext } from "playwright";

import {
    FetchReviewsResponse,
    RawReview,
} from "./RawReview.js";

import { Logger } from "../utils/Logger.js";

export class ReviewsApi {
    private static readonly PAGE_SIZE = 50;
    private static readonly MAX_PAGES = 12000;
    private static readonly MAX_REVIEWS = 600;

    constructor(
        private readonly request: APIRequestContext,
    ) {}

    async fetchAll(fetchReviewsUrl: string): Promise<RawReview[]> {
        const reviews = new Map<string, RawReview>();

        for (
            let page = 1;
            page <= ReviewsApi.MAX_PAGES;
            page++
        ) {
            const url = new URL(fetchReviewsUrl);
            Logger.write(url.toString());
            url.searchParams.set("page", String(page));
            url.searchParams.set(
                "pageSize",
                String(ReviewsApi.PAGE_SIZE),
            );

            Logger.write(
                `Fetching reviews page=${page}: ${url.toString()}`,
            );

            const response = await this.request.get(
                url.toString(),
            );

            if (!response.ok()) {
                throw new Error(
                    `fetchReviews failed (${response.status()}) on page ${page}`,
                );
            }

            const json =
                (await response.json()) as FetchReviewsResponse;


            const items =
                json.data?.reviews ??
                json.result?.reviews ??
                json.reviews ??
                [];

            Logger.write(
                `Page ${page}: received ${items.length} reviews`,
            );

            if (items.length === 0) {
                Logger.write(
                    `Stopping: empty page ${page}`,
                );
                break;
            }

            for (const review of items) {
                if (!review.reviewId) {
                    continue;
                }

                reviews.set(
                    review.reviewId,
                    review,
                );

                if (
                    reviews.size >=
                    ReviewsApi.MAX_REVIEWS
                ) {
                    Logger.write(
                        `Stopping: reached ${ReviewsApi.MAX_REVIEWS} reviews`,
                    );
                    break;
                }
            }

            // if (
            //     reviews.size >=
            //     ReviewsApi.MAX_REVIEWS
            // ) {
            //     break;
            // }

            // Если сервер вернул меньше PAGE_SIZE,
            // скорее всего это последняя страница.
            if (
                items.length <
                ReviewsApi.PAGE_SIZE
            ) {
                Logger.write(
                    `Stopping: last page detected (${items.length} < ${ReviewsApi.PAGE_SIZE})`,
                );
                break;
            }
        }

        Logger.write(
            `Total unique reviews: ${reviews.size}`,
        );

        return Array.from(reviews.values());
    }
}