import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

export class Logger {
    private static readonly file = "./logs/parser.log";

    static write(message: string): void {
        mkdirSync(dirname(this.file), { recursive: true });

        appendFileSync(
            this.file,
            `[${new Date().toISOString()}] ${message}\n`,
            "utf8",
        );
    }

    static json(title: string, data: unknown): void {
        this.write(title);
        this.write(JSON.stringify(data, null, 2));
    }

    static clear(): void {
        mkdirSync(dirname(this.file), { recursive: true });
        appendFileSync(this.file, "", "utf8");
    }
}