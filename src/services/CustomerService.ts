import ModelService from "@/services/ModelService";

export default class CustomerService extends ModelService {

    constructor() {
        super();
        this.url = 'v1/customer';
    }
}
