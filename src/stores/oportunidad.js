import {defineStore} from 'pinia';
import { PAGE_LIMIT } from "@/stub/constans";

export const useOportunidadStore = defineStore("oportunidad", {
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
                value: 'oportunidad',
                comparison: '='
            },    
            name: {
                value: '',
                comparison: '='
            },    
            source: {
                value: '',
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
                value: '',
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