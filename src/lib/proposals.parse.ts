
import cheerio from 'cheerio';
import {CheerioAPI} from "cheerio/lib/load";
import {ProposalsRepository} from "./proposals.repository";
import {log} from "apify";
import jqueryLocators from "./jquery-locators/jquery-locators.jquery.json"


export class ProposalsParse {

    $: CheerioAPI
    repository: ProposalsRepository
    constructor(html: string) {
        this.$ = cheerio.load(html);
        this.repository = ProposalsRepository.getInstance();
    }

    getProposalsDescription(): string[] {
        const links = this.$('.up-proposals-list__block div[data-qa="info"] a');
        const hrefs = links.map((index, el) => {
            const href = `https://www.upwork.com` + (links[index].attributes.find(el => el.name === "href")).value;
            return href;
        })
        const description = links.map((index, el) => {
            const element = [{name: this.$(el).text()}];
            return element;
        });
        const descriptionArr = description.toArray();
        const descriptionParsed = descriptionArr.map(el => [el]);
        this.repository.setToRepository(descriptionParsed);
        return hrefs.toArray();
    }

    async getProposalDetailUpper(index: number) {
        const dataCollected = [];
        /** Job detail */
        const jobDetail = await this.$(jqueryLocators.proposals.jobDetail);
        if (jobDetail.length) {
            dataCollected.push({jobDetail: jobDetail.text().trim()});
        }
        /** Date posted */
        const datePosted = await this.$(jqueryLocators.proposals.datePosted);
        if (datePosted.length) {
            dataCollected.push({datePosted: datePosted.text().trim()});
        }
        /** Description full */
        const descriptionFull =await  this.$(jqueryLocators.proposals.descriptionFull);
        if (descriptionFull.length){
            dataCollected.push({descriptionFull: descriptionFull.text().replaceAll('\n', "")});
        }
        /** Experience level && Terms && Length project */
        const conditions = await this.$(jqueryLocators.proposals.conditions);
        let terms = await this.$(jqueryLocators.proposals.terms);
        if (conditions.length && terms.length) {
            let condArr =[];
            let termArr = [];
            conditions.map((i, condition) => {
                condArr.push(this.$(condition).text());
            })
            terms.map((i, term) => {
                termArr.push(this.$(term).text());
            })
            for (let i = 0; i < conditions.length; i++) {
                const condTxt = condArr[i];
                const termTxt = termArr[i].replace(/\s+/g, ' ').trim();
                dataCollected.push({condTxt, termTxt})
            }
        }
        let linkItem = this.repository.getItemByIndex(index);
        for (let data of dataCollected) {
            linkItem.push(data);
        }
        log.info(dataCollected.toString())
    }


    async getProposalDetailDown(index: number) {
        let skillsAndExpertise = await this.$(jqueryLocators.proposals.skillsAndExpertise);
        let skillAndExpertiseToPush;
        const textSkills = []
        if (skillsAndExpertise.length) {
            /** Extract data from html */
            skillsAndExpertise.map((i, el) => {
                textSkills.push(this.$(el).text().trim());
            })

            /** Set data to repository */
            skillAndExpertiseToPush = [{skillAndExpertise: textSkills}];
            this.repository.setToRepositoryIndex(index, skillAndExpertiseToPush)
        }
        let clientBudget = await this.$(jqueryLocators.proposals.clientBudget);
        let budgetToPush;
        if (clientBudget.length) {
            /** Extract data from html */
            const budget$ = this.$(clientBudget).text().trim().split(":")[1].trim();

            /** Set data to repository */
            budgetToPush = [{clientBudget: budget$}];
            this.repository.setToRepositoryIndex(index, budgetToPush)
        }

        let termsReviewFixedPrice = await this.$(jqueryLocators.proposals.termsReviewFixedPrice);
        if (termsReviewFixedPrice.length) {
            /** Extract data from html */
            let howToPaid = this.$(termsReviewFixedPrice[0]).text().trim().split("\n").map(el => el.trim());
            let totalPrice = this.$(termsReviewFixedPrice[3]).text().trim().split("\n").map(el => el.trim());
            let youWillReceive = this.$(termsReviewFixedPrice[6]).text().trim().split("\n").map(el => el.trim());

            /** Set data to repository */
            let data = [
                {howDoYouWantToBePaid: howToPaid[1]},
                {totalPriceOfProject: totalPrice[1]},
                {youWillReceiveAfterTaxes: youWillReceive[1]}
            ];
            this.repository.setToRepositoryIndex(index, data);
        }
        let termsReviewHourly = await this.$(jqueryLocators.proposals.termsReviewHourly);
        if (termsReviewHourly.length) {
            let hourlyRate = this.$(termsReviewHourly[2]).text().trim();
            let youWillReceive = this.$(termsReviewHourly[5]).text().trim();

            let data = [
                {hourlyRate: hourlyRate},
                {youWillReceive: youWillReceive}
            ]
            this.repository.setToRepositoryIndex(index, data);
        }
    }

    async getProposalDetailRight(index: number) {
        const paymentMethodVerified = await this.$(jqueryLocators.proposals.paymentMethodVerified);
        if (paymentMethodVerified.length) {
            const paymentMethodVerifiedToPush = [{paymentMethod: this.$(paymentMethodVerified).text().trim()}];
            this.repository.setToRepositoryIndex(index, paymentMethodVerifiedToPush);
        }
        const paymentMethodNotVerified = await this.$(jqueryLocators.proposals.paymentMethodNotVerified);
        if (paymentMethodNotVerified.length) {
            const paymentMethodNotVerifiedToPush = [{paymentMethod: this.$(paymentMethodNotVerified).text().trim().split('\n').shift()}];
            this.repository.setToRepositoryIndex(index, paymentMethodNotVerifiedToPush);
        }
        const location = await this.$(jqueryLocators.proposals.location);
        if (location.length > 0) {
            const locationToPush = [{location: this.$(location[1]).text().trim()}];
            this.repository.setToRepositoryIndex(index, locationToPush)
        }
        const history = await this.$(jqueryLocators.proposals.history);
        if (history.length) {
            const stop = history.length / 2;
            const historyArray = [];
            history.map((i, el) => {
                if (i < stop) {
                    historyArray.push(this.$(el).text().replace(/\s+/g, ' ').trim())
                }
            })
            const historyToPush = [{history: historyArray}];
            this.repository.setToRepositoryIndex(index, historyToPush)
        }
    }
}