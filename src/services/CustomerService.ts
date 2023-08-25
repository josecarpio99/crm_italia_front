import ModelService from "@/services/ModelService";

export default class CustomerService extends ModelService {

    constructor() {
        super();
        this.url = 'v1/customer';
    }

    public toggleStar(id) {
        return this.post( 
            this.url + `/${id}/star`,
            [], 
            {
                'Content-Type': 'application/json'
            }
        );
    }
}
