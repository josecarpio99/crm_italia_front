<template>
  <Page 
    :title="page.title" 
    :showFooter="page.showFooter"
    :is-loading="page.isLoading"
  > 
      <template #filters>
        <div class="py-4 pl-10 bg-white flex items-center gap-4">
          <TextInput
            class="flex items-center gap-2 w-64"
            type="date" 
            name="since-input" 
            label="Desde:"
            v-model="sinceDate"
            :max="dayjs().format('YYYY-MM-DD')"
            @update:modelValue="setSinceQueryValue"
          />  

          <TextInput
            class="flex items-center gap-2 w-64"
            type="date" 
            name="until-input" 
            label="Hasta:"
            v-model="untilDate"
            :max="dayjs().format('YYYY-MM-DD')"
            @update:modelValue="setUntilQueryValue"
          />  
        </div>
      </template> 
      <template #default>
          <Table :id="page.id" v-if="table" :columns="table.columns" :records="table.records" :pagination="table.pagination" :is-loading="table.loading" @sort="onTableSort" @filter="onTableFilter">           

            <template #cell-branch="{item}">                  
              <BranchField :value="item.branch" />
            </template>

            <template #cell-venta_neta="{item}">           
              <ValueField :value="item.venta_neta" />
            </template>

            <template #cell-inversion="{item}">           
              <ValueField :value="item.inversion" />
            </template>

            <template #cell-hit_rate="{item}">           
              {{ item.hit_rate.toFixed(2) + '%' }}
            </template>

            <template #cell-roa="{item}">           
              {{ item.roa.toFixed(2) }}
            </template>

            
          </Table>
      </template>
  </Page>  
</template>

<script setup>
import {trans} from "@/helpers/i18n";
import {watch, onMounted, reactive, ref } from 'vue';
import $date from "@/helpers/date";
import {getResponseError, prepareQuery} from "@/helpers/api";
import {toUrl} from "@/helpers/routing";
import ReportService from "@/services/ReportService";
import Icon from "@/views/components/icons/Icon";
import Table from "@/views/components/Table";
import ValueField from "@/views/components/ValueField";
import BranchField from "@/views/components/BranchField";
import Page from "@/views/layouts/Page";
import CircleAvatarIcon from "@/views/components/icons/CircleAvatar";
import { branches } from "@/stub/statuses";
import TextInput from "@/views/components/input/TextInput";
import dayjs from 'dayjs';

const reportService = new ReportService();
const sinceDate = dayjs().startOf('month').format('YYYY-MM-DD');
const untilDate = dayjs().format('YYYY-MM-DD');

const mainQuery = reactive({
  page: 1,
  limit: 'all',
  search: '',
  sort: '',
  filters: {        
      since: {
          value: sinceDate,
          comparison: '='
      },       
      until: {
          value: untilDate,
          comparison: '='
      },       
  }
});

const page = reactive({
  id: 'branch_report',
  title: trans('global.pages.global_resume'),
  toggleFilters: false,
  showFooter: false,
  isLoading: false
});

const table = reactive({ 
  columns: [   
    {
      key: 'branch',
      label: trans('users.labels.branch'),
      show: true,     
    },
    {
      key: 'total',
      label: trans('total'),
      show: true,     
    },
    {
      key: 'ganados',
      label: 'Ganados',
      show: true,     
    },
    {
      key: 'perdidos',
      label: 'Perdidos',
      show: true,     
    },
    {
      key: 'vivos',
      label: 'Vivos',
      show: true,     
    },
    {
      key: 'hit_rate',
      label: 'Hit Rate',
      show: true,     
    },
    {
      key: 'venta_neta',
      label: 'Venta Neta',
      show: true,     
    },
    {
      key: 'inversion',
      label: 'Inversión',
      show: true,     
    },
    {
      key: 'roa',
      label: 'ROA',
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

function onTableFilter({column, value}) {
    if (column.key == 'branch') {
      mainQuery.filters[column.key].value = (value) ? value.map(item => item.id).join(',') : null;
    } else {
      mainQuery.filters[column.key].value = value || null;
    }

    let _column = table.columns.find(tableColumn => tableColumn.key == column.key);
    
    _column.filter.modelValue = value;
}

function onTableSort(params) {
  mainQuery.sort = params;
}

function setSinceQueryValue(value) {
  console.log(value);
  mainQuery.filters.since.value = value;
}

function setUntilQueryValue(value) {
  console.log(value);
  mainQuery.filters.until.value = value;
}

function fetchPage(params) {
  table.records = [];
  table.loading = true;
  let query = prepareQuery(params);
  reportService
      .branch(query)
      .then((response) => {
          table.records = response.data.data;
          table.loading = false;
      })
      .catch((error) => {
          alertStore.error(getResponseError(error));
          table.loading = false;
      });
}

watch(mainQuery, (newTableState) => {
  fetchPage(mainQuery);
});

onMounted(async () => { 
  fetchPage(mainQuery);
});


</script>