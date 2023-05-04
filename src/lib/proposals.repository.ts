import {log} from "apify";


export class ProposalsRepository {
    private static instance: ProposalsRepository;

    repository: Array<Array<{}>> = [];
    private constructor() {

    }

    static getInstance(): ProposalsRepository {
        if (!ProposalsRepository.instance) {
            ProposalsRepository.instance = new ProposalsRepository();
        }

        return ProposalsRepository.instance;
    }

    setToRepository(data) {
        this.repository.push(...data)
    }

    getRepository(){
        return this.repository;
    }

    getItemByIndex(i: number) {
        return this.repository[i]
    }

    setToRepositoryIndex(i: number, data: [] | {}[]) {
        log.info(`${ProposalsRepository.name} start set to repository...`);
        const linkItem = this.getItemByIndex(i);
        for (let it of data) {
            linkItem.push(it);
        }
        log.info(`${ProposalsRepository.name} successfully set to repository`)
    }
}

