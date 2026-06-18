import type { Page } from "playwright";

export class ReviewScroller {
    constructor(
        private readonly page: Page,
        private readonly totalPage: number
    ) {}

    async scrollToBottom(): Promise<void> {
        let stableCount = 0;

        while (stableCount < this.totalPage) {
            await this.page.evaluate(() => {
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

            stableCount++;
            await this.page.waitForTimeout(1000);
        }
    }
}