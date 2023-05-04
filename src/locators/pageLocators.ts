import {MainPage} from "../pages/mainPage.page";
import {Locator, Page} from "playwright";


export class PageLocators extends MainPage {

    page: Page
    constructor(page: Page) {
        super();
        this.page = page
    }


    get inputLogin(): Locator {
        return this.page.locator('//input[@id="login_username"]');
    }

    get proposalDetails(): Locator {
        return this.page.locator('//h1[contains(text(), "Proposal details")]')
    }

    get footer(): Locator {
        return this.page.locator('(//footer)[2]')
    }

    get buttonContinueWithEmail(): Locator {
        return this.page.locator('//button[@id="login_password_continue"]')
    }

    get inputPassword(): Locator {
        return this.page.locator('//input[@id="login_password"]')
    }

    get logInButton(): Locator {
        return this.page.locator('//button[@id="login_control_continue"]')
    }

    get moreBtn(): Locator {
        return this.page.locator('(//span[contains(@class, "up-truncation-label")])[1]');
    }

    get cookieBanner(): Locator {
        return this.page.locator('//div[@aria-label="This site uses cookies"]');
    }

    get closeBtnCookie(): Locator {
        return this.page.locator('//button[contains(@class, "banner-close-button")]')
    }
}