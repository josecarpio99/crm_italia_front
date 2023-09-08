import ModelService from "@/services/ModelService";

export default class ReportService extends ModelService {

    constructor() {
        super();
        this.url = 'v1/report';
    }

    public sellsByAdvisors(params = {}) {
      let path = this.url + `/sells-by-advisor`;
      let query = new URLSearchParams(params).toString();
      if (query) {
          path += '?' + query
      }
      return this.get( 
          path,
          null, 
           {
              'Content-Type': 'application/json'
          }
      );
  }
}
