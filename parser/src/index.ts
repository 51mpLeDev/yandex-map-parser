import { YandexParser } from "./parser/YandexParser.js";
import {BrowserFactory} from "./parser/BrowserFactory.js";
import {Logger} from "./utils/Logger.js";

const url = process.argv[2];

if (!url) {
    console.error("Usage: npm run parse <yandex-url>");
    process.exit(1);
}
const browser = await BrowserFactory.create();


try {
    const parser = new YandexParser(browser);

    const company = await parser.parse(url);

    Logger.write(JSON.stringify(company, null, 2));
} finally {
    Logger.write("CLOSING BROWSER");
    await browser.close();
}