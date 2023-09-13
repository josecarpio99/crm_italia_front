<template>
   <Page 
    :title="page.title" 
    :showFooter="page.showFooter"
    :is-loading="page.isLoading"
  > 
    <template #default>
      <Table :id="page.id" v-if="table" :columns="table.columns" :records="table.records" :pagination="table.pagination" :is-loading="table.loading" @sort="onTableSort" @filter="onTableFilter"> 
        
        <template #cell-january="{item}">           
          <ValueField :value="item.january?.sum" />
        </template>

        <template #cell-february="{item}">           
          <ValueField :value="item.february?.sum" />
        </template>
        
        <template #cell-march="{item}">           
          <ValueField :value="item.march?.sum" />
        </template>
        
        <template #cell-april="{item}">           
          <ValueField :value="item.april?.sum" />
        </template>
        
        <template #cell-may="{item}">           
          <ValueField :value="item.may?.sum" />
        </template>
        
        <template #cell-june="{item}">           
          <ValueField :value="item.june?.sum" />
        </template>
        
        <template #cell-july="{item}">           
          <ValueField :value="item.july?.sum" />
        </template>
        
        <template #cell-august="{item}">           
          <ValueField :value="item.august?.sum" />
        </template>
        
        <template #cell-september="{item}">           
          <ValueField :value="item.september?.sum" />
        </template>
        
        <template #cell-october="{item}">           
          <ValueField :value="item.october?.sum" />
        </template>
        
        <template #cell-november="{item}">           
          <ValueField :value="item.november?.sum" />
        </template>
        
        <template #cell-december="{item}">           
          <ValueField :value="item.december?.sum" />
        </template>

        <template #cell-total="{item}">           
          <ValueField :value="item.total" />
        </template>

        <template #cell-avg="{item}">           
          <ValueField :value="item.avg" />
        </template>

        <template #cell-branch="{item}">                  
          <BranchField :value="item.branch" />
        </template>

        <template #cell-name="{item}">             
          <CircleAvatarIcon :avatarUrl="item.avatar_url" :user="item" />              
          {{ item.name }}
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

const reportService = new ReportService();

const mainQuery = reactive({
  page: 1,
  limit: 'all',
  search: '',
  sort: '',
  filters: {
      name: {
          value: '',
          comparison: '='
      },    
      branch: {
          value: '',
          comparison: '='
      }     
  }
});

const page = reactive({
  id: 'sells_by_advisors',
  title: trans('global.menu.sells_by_advisors'),
  toggleFilters: false,
  showFooter: false,
  isLoading: false
});

let month = (new Date()).getMonth();

const table = reactive({ 
  columns: [
    {
      key: 'name',
      label: trans('users.header.seller'),
      show: true,
      filterable: false,
      sorteable: false,
      filter: {
        modelValue: '',
        type: 'input'            
      }
    },
    {
      key: 'branch',
      label: trans('users.labels.branch'),
      show: true,
      locked: false,
      editable: false,
      sorteable: false,
      filterable: false,
      // filter: {
      //   modelValue: '',
      //   type: 'multiselect',
      //   options: branches,
      // }
    },
    {
      key: 'january',
      label: trans('january'),
      show: true,
      sorteable: false
    },
    {
      key: 'february',
      label: trans('february'),
      show: month >= 1,
      sorteable: false
    },
    {
      key: 'march',
      label: trans('march'),
      show: month >= 2,
      sorteable: false
    },
    {
      key: 'april',
      label: trans('april'),
      show: month >= 3,
      sorteable: false
    },
    {
      key: 'may',
      label: trans('may'),
      show: month >= 4,
      sorteable: false
    },
    {
      key: 'june',
      label: trans('june'),
      show: month >= 5,
      sorteable: false
    },
    {
      key: 'july',
      label: trans('july'),
      show: month >= 6,
      sorteable: false
    },
    {
      key: 'august',
      label: trans('august'),
      show: month >= 7,
      sorteable: false
    },
    {
      key: 'september',
      label: trans('september'),
      show: month >= 8,
      sorteable: false
    },
    {
      key: 'october',
      label: trans('october'),
      show: month >= 9,
      sorteable: false
    },
    {
      key: 'november',
      label: trans('november'),
      show: month >= 10,
      sorteable: false
    },
    {
      key: 'december',
      label: trans('december'),
      show: month >= 11,
      sorteable: false
    },
    {
      key: 'total',
      label: trans('total'),
      show: true,
      sorteable: false
    },
    {
      key: 'avg',
      label: trans('month_average'),
      show: true,
      sorteable: false
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

function fetchPage(params) {
  table.records = [];
  table.loading = true;
  let query = prepareQuery(params);
  reportService
      .sellsByAdvisors(query)
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