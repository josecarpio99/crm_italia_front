<template>
  <Page 
    :title="page.title" 
    :showFooter="page.showFooter"
    :is-loading="page.isLoading"
  > 
      <template #default>
          <Table :id="page.id" v-if="table" :columns="table.columns" :records="table.records" :pagination="table.pagination" :is-loading="table.loading">           

            <template #cell-opportunities_estimated_size_sum="{item}">
              {{ '$' + item.opportunities_estimated_size_sum?.toLocaleString('en-US') }}
            </template>

            <template #cell-quotations_value_sum="{item}">
              {{ '$' + item.quotations_value_sum?.toLocaleString('en-US') }}
            </template>
            
          </Table>
      </template>

      <!-- <template v-if="!table.loading" #footer>
        <div class="flex items-center">
          <div class="flex items-center">
            <span class="text-lg text-gray-600 font-semibold">{{ trans('global.labels.resume') }}</span>
          </div>
          <div class="flex ml-14 gap-10 text-sm uppercase w-full lg:w-[550px] text-gray-500 tracking-tight">
            <div class="flex items-center">
              <span>{{ trans('deals.labels.total_deals') }}</span>
              <span class="ml-2 text-xl font-semibold text-gray-400 tracking-tight">{{ table.pagination.meta.total }}</span>
            </div>
            <div class="flex items-center">
              <span>{{ trans('deals.labels.value_total') }}</span>
              <span class="ml-2 text-xl font-semibold text-gray-400 tracking-tight">
                MXN{{ numberFormatter.format(table.pagination.meta.valueSum) }}
              </span>
            </div>
            <div class="flex items-center">
              <span>{{ trans('deals.labels.value_avg') }}</span>
              <span class="ml-2 text-xl font-semibold text-gray-400 tracking-tight">
                MXN{{ numberFormatter.format(table.pagination.meta.valueAvg) }}
              </span>
            </div>
          </div>
        </div>
      </template> -->
  </Page>  
</template>

<script setup>
import {trans} from "@/helpers/i18n";
import {watch, onMounted, reactive, ref } from 'vue';
import $date from "@/helpers/date";
import {getResponseError, prepareQuery} from "@/helpers/api";
import {toUrl} from "@/helpers/routing";
import ScorecardService from "@/services/ScorecardService";
import Icon from "@/views/components/icons/Icon";
import Table from "@/views/components/Table";
import Page from "@/views/layouts/Page";
import CircleAvatarIcon from "@/views/components/icons/CircleAvatar";

const scorecardService = new ScorecardService();

const page = reactive({
  id: 'list_scorecard',
  title: trans('global.menu.scorecard'),
  toggleFilters: false,
  showFooter: false,
  isLoading: false
});

const table = reactive({ 
  columns: [
    {
      key: 'name',
      label: trans('users.header.seller'),
      show: true,
    },
    {
      key: 'opportunities_estimated_size_sum',
      label: trans('users.header.opportunities_estimated'),
      show: true,
    },
    {
      key: 'opportunities_score',
      label: trans('users.header.opportunities_score'),
      show: true,
    },
    {
      key: 'quotations_value_sum',
      label: trans('users.header.active_quotations'),
      show: true,
    },
    {
      key: 'quotations_score',
      label: trans('users.header.quotations_score'),
      show: true,
    },
    {
      key: 'total_score',
      label: trans('users.header.total_score'),
      show: true,

    },
  ],           
  pagination: {
      meta: null,
      links: null,
  },
  loading: true,
  records: null  
});

function fetchPage() {
  table.records = [];
  table.loading = true;
  scorecardService
      .index()
      .then((response) => {
          table.records = response.data.data;
          table.loading = false;
      })
      .catch((error) => {
          alertStore.error(getResponseError(error));
          table.loading = false;
      });
}

onMounted(async () => { 
  fetchPage();
});


</script>