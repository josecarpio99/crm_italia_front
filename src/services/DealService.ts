import ModelService from "@/services/ModelService";

export default class DealService extends ModelService {

    constructor() {
        super();
        this.url = 'v1/deal';
    }
}
