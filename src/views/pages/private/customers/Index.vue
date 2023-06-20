<template>
  <Page 
    :title="page.title" 
    :breadcrumbs="page.breadcrumbs" 
    :actions="page.actions" 
    @action="onPageAction"
    :showFooter="page.showFooter"
  >      
      <template #default>
          <Table :id="page.id" v-if="table" :columns="table.columns" :records="table.records" :pagination="table.pagination" :is-loading="table.loading" @page-changed="onTablePageChange" @action="onTableAction" @sort="onTableSort" @filter="onTableFilter" @cell-change="onCellChange">
            <template #cell-name="{item}">
              <router-link 
                class="font-semibold hover:text-blue-700 hover:underline"
                :to="{name: 'customers.show', params: {id: item.id}}"
              >
                <Icon 
                  v-if="item.name" 
                  class="mr-2 text-xl align-middle" 
                  :name="item.is_company ? 'building-o' : 'user-o'" 
                />
                {{ item.name }}
              </router-link>
            </template>

            <template #cell-mobile="{item}">
              <Icon v-if="item.mobile" class="mr-2 text-xl align-middle" name="mobile-phone" />
              {{ item.mobile }}
            </template>

            <template #cell-owner="{item}">             
              <CircleAvatarIcon />              
              {{ item.owner.name }}
            </template>
          </Table>
      </template>

      <template v-if="!table.loading" #footer>
        <div class="flex items-center">
          <div class="flex items-center">
            <span class="text-lg text-gray-600 font-semibold">{{ trans('global.labels.resume') }}</span>
          </div>
          <div class="flex ml-14 gap-10 text-sm uppercase w-full lg:w-[550px] text-gray-500 tracking-tight">
            <div class="flex items-center">
              <span>{{ trans('customers.labels.total_contacts') }}</span>
              <span class="ml-2 text-xl font-semibold text-gray-400 tracking-tight">{{ table.pagination.meta.total }}</span>
            </div>
            <div class="flex items-center">
              <span>{{ trans('customers.labels.clients') }}</span>
              <span class="ml-2 text-xl font-semibold text-gray-400 tracking-tight">{{ table.pagination.meta.totalClients }}</span>
            </div>
            <div class="flex items-center">
              <span>{{ trans('customers.labels.potential_clients') }}</span>
              <span class="ml-2 text-xl font-semibold text-gray-400 tracking-tight">{{ table.pagination.meta.totalPotentialClients }}</span>
            </div>
          </div>
        </div>
      </template>
  </Page>
</template>

<script setup>

import {trans} from "@/helpers/i18n";
import CustomerService from "@/services/CustomerService";
import {watch, onMounted, defineComponent, reactive, ref, defineAsyncComponent } from 'vue';
import {getResponseError, prepareQuery} from "@/helpers/api";
import {toUrl} from "@/helpers/routing";
import {useAlertStore} from "@/stores";
import alertHelpers from "@/helpers/alert";
import Icon from "@/views/components/icons/Icon";
import CircleAvatarIcon from "@/views/components/icons/CircleAvatar";
import Page from "@/views/layouts/Page";
import Table from "@/views/components/Table";
import Avatar from "@/views/components/icons/Avatar";
import Filters from "@/views/components/filters/Filters";
import FiltersRow from "@/views/components/filters/FiltersRow";
import FiltersCol from "@/views/components/filters/FiltersCol";
import TextInput from "@/views/components/input/TextInput";
import Dropdown from "@/views/components/input/Dropdown";
import {customerCategories} from "@/stub/categories";
import { customerStatuses } from "@/stub/statuses";
import {clearObject, removeEmpty} from "@/helpers/data";
import {useUsersStore} from "@/stores/users";

const service = new CustomerService();
const alertStore = useAlertStore();
const usersStore = useUsersStore();
let users = usersStore.userList;

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
      owner: {
          value: [],
          comparison: '='
      },
      customer_status: {
          value: '',
          comparison: '='
      },   
      category_id: {
          value: '',
          comparison: '='
      }
  }
});

const page = reactive({
  id: 'list_customers',
  title: trans('global.pages.customers'),
  breadcrumbs: [
      {
          name: trans('global.pages.customers'),
          to: toUrl('/customers'),
          active: true,
      }
  ],  
  toggleFilters: false,
  showFooter: true,
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
          key: 'email',
          label: trans('global.labels.email'),
          sorteable: true,
          editable: true
      },    
      {
          key: 'mobile',
          label: trans('customers.header.phone'),
          sorteable: false,
          editable: true
      },    
      {
          key: 'category',
          label: trans('customers.labels.category'),
          sorteable: false,
          filterable: true,
          editable: true,
          filter: {
            modelValue: '',
            type: 'select',
            options: customerCategories
          },
          edit: {
            type: 'list',
            options: customerCategories
          },
          cellKey: 'category.id',
          cellLabel: 'category.name'
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
          key: 'customer_status',
          label: trans('customers.labels.customer_status'),
          sorteable: false,
          filterable: true,
          editable: true,
          filter: {
            modelValue:'',
            type: 'select',
            options: customerStatuses
          },
          edit: {
            type: 'list',
            options: customerStatuses
          }
      },    
  ],           
  pagination: {
      meta: null,
      links: null,
  },
  actions: {
      // edit: {
      //     id: 'edit',
      //     name: trans('global.actions.edit'),
      //     icon: "fa fa-edit",
      //     showName: false,
      //     to: toUrl('/customers/{id}/edit')
      // },
      delete: {
          id: 'delete',
          name: trans('global.actions.delete'),
          icon: "fa fa-trash",
          showName: false,
          danger: true,
      }
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
              service.delete(params.item.id).then(function (response) {
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
  service
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

  if (payload.key == 'category') {

    record.category_id = payload.value.id;
    record.category = {
        id: payload.value.id,
        name: payload.value.label
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
  
  service.handleUpdate(page.id, record.id, removeEmpty(record))
    .then((res) => {     
        if (res.response?.status >= 400) {            
            Object.assign(record, oldRecord);
        }
    });
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
  let ownerColumn = table.columns.find(column => column.key == 'owner');
  ownerColumn.filter.options = users;
  ownerColumn.edit.options = users;

  fetchPage(mainQuery);
});

</script>
