
import {Browser, chromium, Page} from "playwright";


const args = [
    "--no-sandbox",
    "--remote-debugging-port=9222",
    "--disable-setuid-sandbox",
    "--ignore-certificate-errors",
    "--disk-cache-size=1",
    "--disable-infobars"
];
export class MainPage {

    browser: Browser
    page: Page
    constructor() {
    }

    async createBrowserAndPage(): Promise<Page> {
        this.browser = await chromium.launch({
            args,
            headless: false,
        })
        this.page = await this.browser.newPage();
        return this.page
    }

    async browserSleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
}