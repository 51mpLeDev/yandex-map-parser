import type {Page, Response} from "playwright";
import {Logger} from "../utils/Logger.js";

export class NetworkInterceptor {
    private readonly reviews: any[] = [];
    private fetchReviewsUrl?: string;
    private totalPages = 0;

    private pending = 0;
    private readonly tasks = new Set<Promise<void>>();
    private firstResponsePromise: Promise<void>;
    private resolveFirstResponse!: () => void;

    constructor() {
        this.firstResponsePromise = new Promise((resolve) => {
            this.resolveFirstResponse = resolve;
        });
    }

    public attach(page: Page): void {
        page.on("response", (response) => {
            const task = this.handleResponse(page, response)
                .catch((e) => {
                    Logger.write(`Interceptor error: ${e}`);
                })
                .finally(() => {
                    this.tasks.delete(task);
                });

            this.tasks.add(task);
        });
    }

    private async handleResponse(page: Page, response: Response): Promise<void> {
        const url = response.url();

        if (!url.includes("/maps/api/business/fetchReviews")) {
            return;
        }
        this.pending++;
        try {
            if (!this.fetchReviewsUrl) {
                this.fetchReviewsUrl = url;
            }

            const json = await response.json();

            const items = json?.data?.reviews ?? [];
            this.totalPages = json?.data?.params?.totalPages ?? 0;

            if (items.length) {
                this.reviews.push(...items);
            }

            this.resolveFirstResponse();

        } catch (e) {
            Logger.write(`Failed to parse fetchReviews response: ${e}`);
        } finally {
            this.pending--;
        }
    }

    public async waitUntilIdle(timeout = 30000): Promise<void> {
        const started = Date.now();

        while (true) {
            if (this.pending === 0 && this.tasks.size === 0) {
                break;
            }

            if (Date.now() - started > timeout) {
                Logger.write("waitUntilIdle timeout");
                break;
            }

            await new Promise((r) => setTimeout(r, 100));
        }
    }

    public getFetchReviewsUrl(): string | undefined {
        return this.fetchReviewsUrl;
    }

    public getTotalPages(): number {
        return this.totalPages;
    }

    public getAllReviews(): any[] {
        return this.reviews;
    }

    public async waitForFirstResponse(timeout = 30000): Promise<void> {
        await Promise.race([
            this.firstResponsePromise,
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Timeout waiting fetchReviews")), timeout),
            ),
        ]);

        await this.waitUntilIdle(timeout);
    }
}