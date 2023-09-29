import ModelService from "@/services/ModelService";

export default class DealService extends ModelService {

    constructor() {
        super();
        this.url = 'v1/deal';
    }

    public convert(id, payload) {
        return this.post( 
            this.url + `/${id}/convert`,
            payload, 
             {
                'Content-Type': 'application/json'
            }
        );
    }

    public confirm(id) {
        return this.post( 
            this.url + `/${id}/confirm`,
            null, 
             {
                'Content-Type': 'application/json'
            }
        );
    }

    public getPendingOpportunities() {
        return this.get( 
            this.url + `/pending`,
            null, 
             {
                'Content-Type': 'application/json'
            }
        );
    }

    public bulkDelete(payload) {
        return this.post( 
            this.url + `/bulk-delete`,
            payload, 
             {
                'Content-Type': 'application/json'
            }
        );
    }

    public massStatusUpdate(payload) {
        return this.post( 
            this.url + `/update-status`,
            payload, 
             {
                'Content-Type': 'application/json'
            }
        );
    }
}
