import ModelService from "@/services/ModelService";

export default class LeadService extends ModelService {

    constructor() {
        super();
        this.url = 'v1/lead';
    }
}