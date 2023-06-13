import {defineStore} from 'pinia';
import CustomerService from "@/services/CustomerService";

export const useCustomersStore = defineStore("customers", {
  state: () => {
    return {
        customerList: null
    }
  },
  actions: {
    async getUserList() {
      const customerService = new CustomerService();
      this.customerList = await customerService.list().then(res => res.data);
    }
  }
});