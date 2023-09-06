import {defineStore} from 'pinia';
import DealService from "@/services/DealService";

export const usePendingOpportunitiesStore = defineStore("pendingOpportunities", {
  state: () => {
    return {
      data: [],
      showModal: false,
      showAlert: false,
      interval: null
    }
  },
  actions: {
    async getPendingOpportunities() {
      const dealService = new DealService();
      this.data = await dealService.getPendingOpportunities().then(res => res.data.data);
    },
    setIntervalFn() {
      this.interval = setInterval(async () => {
          if (this.first) return;

          await this.getPendingOpportunities();

          if (this.first) {
              if (this.showAlert == false) {
                  this.showModal = true;                        
              }

              this.showAlert = true;
          } else {
            this.showAlert = false;
            this.showModal = false;
          }              
      }, 5000);      
    },
    stopIntervalFn() {
      clearInterval(this.interval);
    },
    answered(id) {
      this.data = this.data.filter(item => item.id != id);

      if (this.isEmpty) {
        this.showAlert = false;
        this.showModal = false;
      }
    }
  },
  getters: {
    isEmpty: (state) => {
      return state.data.length == 0;
    },
    count: (state) => {
      return state.data.length;
    },
    first(state) {
      return state.data[0] ?? null;
    },
  }
});