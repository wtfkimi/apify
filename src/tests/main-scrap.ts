
import {Actor as Apify, log} from "apify";
import {chromium, Page} from "playwright";
import {LoginPagePage} from "../pages/loginPage.page";
import {MainPage} from "../pages/mainPage.page";
import { gotScraping } from 'got-scraping';
import cheerio from 'cheerio';
import {ProposalsParse} from "../lib/proposals.parse";
import {ProposalsRepository} from "../lib/proposals.repository";


Apify.main(async () => {

   log.info('start login to work up...')
   const mainPage = new MainPage();
   const page: Page = await mainPage.createBrowserAndPage();
   const loginPage = new LoginPagePage(page);
   await loginPage.goToLoginPage();
   await loginPage.setUserNameAndPassword();
   await mainPage.browserSleep(10000);
   log.info('login successfully');

   log.info('start parse proposals');
   await loginPage.goToProposals();
   const content = await loginPage.getContent();
   let proposalParse = new ProposalsParse(content);
   const links = proposalParse.getProposalsDescription();
   for (let i = 0; i < links.length; i++) {
      const linkId = links[i].split("/").pop();
      await loginPage.goToProposals(linkId);
      if (await loginPage.isExistMoreBtn()) {
         if (await loginPage.isExistCookieBanner()){
            await loginPage.closeCookieBanner();
         }
         await loginPage.clickMoreBtn();
      }
      await loginPage.waitForProposalsLoaded();
      const ctx = await loginPage.getContent();
      proposalParse = new ProposalsParse(ctx);
      await proposalParse.getProposalDetailUpper(i);
      await proposalParse.getProposalDetailDown(i);
      await proposalParse.getProposalDetailRight(i)
   }
   const instance = ProposalsRepository.getInstance().getRepository()[0];
   for (let item of instance) {
      log.info(JSON.stringify(item))
   }
   log.info('parsing successfully done');

});
