import {defineStore} from 'pinia';
import { PAGE_LIMIT } from "@/stub/constans";

export const useDealStore = defineStore("deal", {
  state: () => {
    return {
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
            type: {
                value: '',
                comparison: '='
            },    
            name: {
                value: '',
                comparison: '='
            },    
            source: {
                value: '2',
                comparison: '='
            },    
            stage: {
                value: '',
                comparison: '='
            },    
            owner: {
                value: '',
                comparison: '='
            },
            creator: {
                value: '',
                comparison: '='
            },
            branch: {
                value: '',
                comparison: '='
            },
            value: {
                value: '',
                comparison: '='
            },
            category: {
                value: '',
                comparison: '='
            },
            status: {
                value: 'en proceso',
                comparison: '='
            },
            closed_at: {
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
});