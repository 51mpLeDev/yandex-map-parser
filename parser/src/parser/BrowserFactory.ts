import { Browser, chromium } from "playwright";

export class BrowserFactory {
    static async create(): Promise<Browser> {
        return chromium.launch({
            headless: process.env.HEADLESS !== "false",
            args: [
                "--disable-blink-features=AutomationControlled",
                "--disable-dev-shm-usage",
                "--no-sandbox",
            ],
        });
    }
}