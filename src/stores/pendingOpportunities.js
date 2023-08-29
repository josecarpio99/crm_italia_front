import {defineStore} from 'pinia';
import DealService from "@/services/DealService";

export const usePendingOpportunitiesStore = defineStore("pendingOpportunities", {
  state: () => {
    return {
      data: []
    }
  },
  actions: {
    async getPendingOpportunities() {
      const dealService = new DealService();
      this.data = await dealService.getPendingOpportunities().then(res => res.data);;
    }    
  },
  getters: {
    isEmpty: (state) => {
      return state.data.length == 0;
    },
    first(state) {
      return state.isEmpty() ? null : state.data[0];
    },
  }
});