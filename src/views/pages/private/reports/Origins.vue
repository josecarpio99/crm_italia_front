<template>
  <Page 
    :title="page.title" 
    :showFooter="page.showFooter"
    :is-loading="page.isLoading"
  >
  </Page>
</template>

<script setup>
import {watch, onMounted, reactive, ref } from 'vue';
import {trans} from "@/helpers/i18n";
import Page from "@/views/layouts/Page";
import DealService from "@/services/DealService";
import {getResponseError, prepareQuery} from "@/helpers/api";
import {useUsersStore} from "@/stores/users";
import {useAuthStore} from "@/stores/auth";
import {useAlertStore} from "@/stores";

const dealService = new DealService();
const alertStore = useAlertStore();
const usersStore = useUsersStore();
const authStore = useAuthStore();

const mainQuery = reactive({
  page: 1,
  limit: 'all',
  search: '',
  sort: '',
  filters: {
      type: {
          value: '',
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
      branch: {
          value: '',
          comparison: '='
      },
      owner: {
          value: '',
          comparison: '='
      },
      value: {
          value: '',
          comparison: '='
      },
      created_at: {
          value: '',
          comparison: '='
      }
  }
});

const page = reactive({
  id: 'origins_page',
  title: trans('global.pages.origins'),
  toggleFilters: false,
  showFooter: false,
  isLoading: false
});

function fetchPage(params) {
  page.loading = true;
  let query = prepareQuery(params);
  dealService
      .index(query)
      .then((response) => {
          console.log(response.data);
          // table.records = response.data.data;
          // table.pagination.meta = response.data.meta;
          page.loading = false;
      })
      .catch((error) => {
          alertStore.error(getResponseError(error));
          table.loading = false;
      });
}

onMounted(async () => { 
  fetchPage(mainQuery);
})

</script>