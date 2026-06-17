import type { Page } from "playwright";

export class ReviewScroller {
    constructor(
        private readonly page: Page,
        private readonly totalPage: number
    ) {}

    async scrollToBottom(): Promise<void> {
        let previousHeight = -1;
        let stableCount = 0;

        while (stableCount < 5) {
            const height = await this.page.evaluate(() => {
                const container = document.querySelector(
                    ".scroll__container",
                ) as HTMLElement | null;

                if (!container) {
                    return 0;
                }

                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: "instant" as ScrollBehavior,
                });

                return container.scrollHeight;
            });

            if (height === previousHeight) {
                stableCount++;
            } else {
                stableCount = 0;
                previousHeight = height;
            }

            await this.page.waitForTimeout(1000);
        }
    }
}