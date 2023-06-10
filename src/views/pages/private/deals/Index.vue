<template>
  <Page :title="page.title" :breadcrumbs="page.breadcrumbs" :actions="page.actions" @action="onPageAction">      
      <template #default>
          <Table :id="page.id" v-if="table" :columns="table.columns" :records="table.records" :pagination="table.pagination" :is-loading="table.loading" @page-changed="onTablePageChange" @action="onTableAction" @sort="onTableSort" @filter="onTableFilter" @cell-change="onCellChange">

            <template #cell-value="{item}">
              {{ 'MXN' + item.value.toLocaleString('en-US') }}
            </template>

          </Table>
      </template>
  </Page>
</template>

<script setup>

import {trans} from "@/helpers/i18n";
import CustomerService from "@/services/CustomerService";
import UserService from "@/services/UserService";
import SourceService from "@/services/SourceService";
import DealService from "@/services/DealService";
import {watch, onMounted, defineComponent, reactive, ref, defineAsyncComponent } from 'vue';
import {getResponseError, prepareQuery} from "@/helpers/api";
import {toUrl} from "@/helpers/routing";
import {useAlertStore} from "@/stores";
import alertHelpers from "@/helpers/alert";
import Page from "@/views/layouts/Page";
import Table from "@/views/components/Table";
import Avatar from "@/views/components/icons/Avatar";
import Filters from "@/views/components/filters/Filters";
import FiltersRow from "@/views/components/filters/FiltersRow";
import FiltersCol from "@/views/components/filters/FiltersCol";
import TextInput from "@/views/components/input/TextInput";
import Dropdown from "@/views/components/input/Dropdown";
import {customerCategories} from "@/stub/categories";
import {clearObject, removeEmpty} from "@/helpers/data";

const dealService = new DealService();
const userService = new UserService();
const sourceService = new SourceService();
const customerService = new CustomerService();
const alertStore = useAlertStore();
let users = null;
let sources = null;

const mainQuery = reactive({
  page: 1,
  search: '',
  sort: '',
  filters: {
      name: {
          value: '',
          comparison: '='
      },    
      source: {
          value: '',
          comparison: '='
      },    
      owner: {
          value: [],
          comparison: '='
      },
  }
});

const page = reactive({
  id: 'list_deals',
  title: trans('global.pages.deals'),
  breadcrumbs: [
      {
          name: trans('global.pages.deals'),
          to: toUrl('/deals'),
          active: true,
      }
  ],  
  toggleFilters: false,
});

const table = reactive({ 
  columns: [
      {
          key: 'name',
          label: trans('global.labels.name'),
          editable: true,
          sorteable: true,
          filterable: true,
          filter: {
            modelValue: '',
            type: 'input'            
          }
      },         
      {
          key: 'value',
          label: trans('global.labels.value'),
          editable: true,
          sorteable: false,
          filterable: false          
      },         
      {
          key: 'source',
          label: trans('global.labels.source'),
          sorteable: false,
          filterable: true,
          editable: true,
          filter: {
            modelValue: '',
            type: 'multiselect',
            options: [],
            optionsLabel: 'name'
          },
          edit: {
            type: 'list',
            options: [],
            optionsLabel: 'name'
          },
          cellKey: 'source.id',
          cellLabel: 'source.name'
      },       
      {
          key: 'owner',
          label: trans('global.labels.owner'),
          sorteable: false,
          filterable: true,
          editable: true,
          filter: {
            modelValue: '',
            type: 'multiselect',
            options: [],
            optionsLabel: 'name'
          },
          edit: {
            type: 'list',
            options: [],
            optionsLabel: 'name'
          },
          cellKey: 'owner.id',
          cellLabel: 'owner.name'
      },
      {
          key: 'created_at',
          label: trans('global.labels.created_at'),
          editable: false,
          sorteable: true,
          filterable: false          
      },         
  ],           
  pagination: {
      meta: null,
      links: null,
  },
  loading: true,
  records: null  
})  

function onTableSort(params) {
  mainQuery.sort = params;
}

function onTablePageChange(page) {
  mainQuery.page = page;
}

function onTableAction(params) {
  switch (params.action.id) {
      case 'delete':
          alertHelpers.confirmDanger(function () {
            dealService.delete(params.item.id).then(function (response) {
                  fetchPage(mainQuery);
              });
          })
          break;
  }
}

function onPageAction(params) {           
  switch (params.action.id) {
      case 'filters':
          page.toggleFilters = !page.toggleFilters;
          break;
  }
}

function onFiltersClear() {
  let clonedFilters = mainQuery.filters;
  for(let key in clonedFilters) {
      clonedFilters[key].value = '';
  }
  mainQuery.filters = clonedFilters;
}

function fetchPage(params) {
  table.records = [];
  table.loading = true;
  let query = prepareQuery(params);
  dealService
      .index(query)
      .then((response) => {
          table.records = response.data.data;
          table.pagination.meta = response.data.meta;
          table.pagination.links = response.data.links;
          table.loading = false;
      })
      .catch((error) => {
          alertStore.error(getResponseError(error));
          table.loading = false;
      });
}

function onCellChange(payload) {
  let record = table.records.find((item) => item.id == payload.record.id);
  let oldRecord = {...record};

  if (record.category) {
    record.category_id = record.category?.id;    
  }

  if (record.customer.category) {
    record.customer.category_id = record.customer.category?.id;    
  }

  if (payload.key == 'category') {
    record.owner_id = payload.value.id;
    record.owner = {
        id: payload.value.id,
        name: payload.value.name
    };
  } else if (payload.key == 'source') {
    record.source_id = payload.value.id;
    record.source = {
        id: payload.value.id,
        name: payload.value.name
    };  
  } else if (payload.key == 'owner') {
    record.owner_id = payload.value.id;
    record.owner = {
        id: payload.value.id,
        name: payload.value.name
    };
  }
   else {
    record[payload.key] = typeof payload.value == 'object' ? payload.value.id : payload.value.toString(); 
  }
  
  if (false) {
    customerService.handleUpdate(page.id, record.customer.id, removeEmpty(record.customer))
      .then((res) => {     
        if (res.response?.status >= 400) {            
            Object.assign(record, oldRecord);
        }
    });
  } else {
    dealService.handleUpdate(page.id, record.id, removeEmpty(record))
      .then((res) => {     
        if (res.response?.status >= 400) {            
            Object.assign(record, oldRecord);
        }
    });
  }
}

function onTableFilter({column, value}) {
    if (column.key == 'owner') {
        mainQuery.filters[column.key].value = value.map(item => item.id).join(',');
    }
    else if (column.key == 'category') {
        mainQuery.filters['category_id'].value = value;
    } 
    else {
        mainQuery.filters[column.key].value = value;
    }
}

watch(mainQuery, (newTableState) => {
  fetchPage(mainQuery);
});

onMounted(async () => {
  users = await userService.list().then(res => res.data);
  sources = await sourceService.index().then(res => res.data);

  let ownerColumn = table.columns.find(column => column.key == 'owner');
  let sourceColumn = table.columns.find(column => column.key == 'source');

  ownerColumn.filter.options = users;
  ownerColumn.edit.options = users;

  sourceColumn.filter.options = sources;
  sourceColumn.edit.options = sources;

  fetchPage(mainQuery);
});

</script>
