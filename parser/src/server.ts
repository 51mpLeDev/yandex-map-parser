import express from "express";
import { YandexParser } from "./parser/YandexParser.js";
import {BrowserFactory} from "./parser/BrowserFactory.js";
import {Logger} from "./utils/Logger.js";

const app = express();
app.use(express.json());

app.post("/parse", async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: "url is required" });
        }
        const browser = await BrowserFactory.create();

        const parser = new YandexParser(browser);
        const result = await parser.parse(url);

        res.json(result);
    } catch (error) {
        Logger.write(`error: ${JSON.stringify(error)}`);
        res.status(500).json({
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

app.listen(3000, "0.0.0.0", () => {
    Logger.write("Parser API listening on :3000");
});