import {MainPage} from "./mainPage.page";
import {Locator, Page} from "playwright";
import data from "../data/test-data.json"
import {PageLocators} from "../locators/pageLocators";


export class LoginPagePage extends MainPage {

    locators: PageLocators;
    constructor(page: Page) {
        super();
        this.locators = new PageLocators(page);
    }
    async goToLoginPage() {
        await this.locators.page.goto('https://www.upwork.com/ab/account-security/login');
    }

    async setUserNameAndPassword() {
        await this.locators.inputLogin.fill(data.email)
        await this.locators.buttonContinueWithEmail.click();
        await this.locators.inputPassword.fill(data.password);
        await this.locators.logInButton.click();
    }

    async goToProposals(link:string = '') {
        return this.locators.page.goto('https://www.upwork.com/ab/proposals/' + link);
    }

    async getContent() {
        // await this.locators.page.waitForLoadState('domcontentloaded');
        const content = await this.locators.page.content();
        return content;
    }

    async waitForProposalsLoaded() {
        await this.locators.proposalDetails.waitFor({state: 'visible', timeout: 45000});
        await this.locators.footer.waitFor({state: 'visible', timeout: 45000});
    }

    async isExistMoreBtn(): Promise<Boolean> {
        return await this.locators.moreBtn.isVisible({timeout: 5000});
    }

    async clickMoreBtn(): Promise<void> {
        await this.locators.moreBtn.click({force: true});
    }

    async isExistCookieBanner(): Promise<boolean> {
        return await this.locators.cookieBanner.isVisible({timeout: 5000})
    }

    async closeCookieBanner(): Promise<void> {
        return await this.locators.closeBtnCookie.click()
    }
}