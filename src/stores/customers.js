import {defineStore} from 'pinia';
import CustomerService from "@/services/CustomerService";
import { PAGE_LIMIT } from "@/stub/constans";

export const useCustomersStore = defineStore("customers", {
  state: () => {
    return {
        customerList: null,
        mainQuery: {
          page: 1,
          limit: PAGE_LIMIT,
          search: '',
          sort: '',
          filters: {
              search: {
                  value: '',
                  comparison: '='
              },    
              name: {
                  value: '',
                  comparison: '='
              },    
              company_name: {
                  value: '',
                  comparison: '='
              }, 
              source: {
                  value: '',
                  comparison: '='
              },     
              owner: {
                  value: '',
                  comparison: '='
              },
              star: {
                  value: '',
                  comparison: '='
              },
              branch: {
                  value: '',
                  comparison: '='
              },
              status: {
                  value: '',
                  comparison: '='
              },   
              category_id: {
                  value: '',
                  comparison: '='
              },
              created_at: {
                  value: '',
                  comparison: '='
              }
          }
        }
    }
  },
  actions: {
    async getCustomerList() {
      const customerService = new CustomerService();
      this.customerList = await customerService.list().then(res => res.data);
    }
  }
});