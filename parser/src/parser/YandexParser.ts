import { Browser } from "playwright";

import type { CompanyData } from "../dto/CompanyData.js";
import type { ReviewData } from "../dto/ReviewData.js";

import { NetworkInterceptor } from "./NetworkInterceptor.js";
import {ReviewScroller} from "./ReviewScroller.js";
import {Logger} from "../utils/Logger.js";

export class YandexParser {
    constructor(
        private readonly browser: Browser,
    ) {}

    async parse(url: string): Promise<CompanyData> {
        const context = await this.browser.newContext();

        try {
            const page = await context.newPage();

            const interceptor = new NetworkInterceptor();
            interceptor.attach(page);

            await page.goto(url, {
                waitUntil: "networkidle",
            });

            await page.locator("h1").first().waitFor({
                state: "visible",
                timeout: 60_000,
            });

            const title =
                (await page.locator("h1").first().textContent())?.trim() ?? "";


            const reviewsTab = page.locator(
                'div[role="tab"][aria-label^="Отзывы"]',
            );

            await reviewsTab.waitFor({
                state: "visible",
            });

            await reviewsTab.click({
                force: true,
            });

            await page.waitForTimeout(500);await page.waitForResponse(
                r => r.url().includes("/maps/api/business/fetchReviews"),
                { timeout: 30000 }
            );

            await page.waitForTimeout(500);

            await interceptor.waitForFirstResponse();

            const fetchReviewsUrl = interceptor.getFetchReviewsUrl();

            if (!fetchReviewsUrl) {
                throw new Error("fetchReviews URL was not intercepted.");
            }

            const getNumericValue = async (selector: string): Promise<number> => {
                const locator = page.locator(selector).first();

                const content = await locator.getAttribute("content");
                if (content) {
                    return Number(content.replace(",", "."));
                }

                const text = (await locator.textContent()) ?? "";
                return Number(text.replace(",", ".").replace(/[^\d.]/g, ""));
            };

            const rating = await getNumericValue('[itemprop="ratingValue"]');
            const ratingsCount = await getNumericValue('[itemprop="ratingCount"]');
            const reviewsCount = await getNumericValue('[itemprop="reviewCount"]');

            const totalPages = interceptor.getTotalPages();

            const scroller = new ReviewScroller(page, totalPages);

            await scroller.scrollToBottom();

            await interceptor.waitUntilIdle();

            const reviews: ReviewData[] = interceptor
                .getAllReviews()
                .map((review) => ({
                    external_id: String(review.reviewId),
                    author: review.author?.name ?? null,
                    rating: review.rating ?? null,
                    text: review.text ?? null,

                    published_at: review.updatedTime ?? null,
                }));

            return {
                title,
                rating: Number.isFinite(rating) ? rating : null,
                ratings_count: Number.isFinite(ratingsCount)
                    ? ratingsCount
                    : 0,
                reviews_count: Number.isFinite(reviewsCount)
                    ? reviewsCount
                    : 0,
                reviews,
            };
        } finally {
            Logger.write("CLOSING CONTEXT");

            await context.close();
        }
    }
}