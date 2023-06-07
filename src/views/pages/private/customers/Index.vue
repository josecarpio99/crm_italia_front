<template>
  <Page :title="page.title" :breadcrumbs="page.breadcrumbs" :actions="page.actions" @action="onPageAction">      
      <template #default>
          <Table :id="page.id" v-if="table" :headers="table.headers" :columns="table.columns" :sorting="table.sorting" :records="table.records" :editableFields="table.editableFields" :pagination="table.pagination" :is-loading="table.loading" @page-changed="onTablePageChange" @action="onTableAction" @sort="onTableSort">   

              <template v-slot:cell-name="{ item }">
                  <TableCell 
                      :cellvalue="item.name"
                      :record="item" 
                      cellkey="name" 
                      @changed="handleCellChange"
                  >                        
                      {{ item.name }}
                  </TableCell>                   
              </template> 

              <template v-slot:cell-email="{ item }">
                  <TableCell 
                      :cellvalue="item.email"
                      :record="item" 
                      cellkey="email" 
                      @changed="handleCellChange"
                  >                        
                      {{ item.email }}
                  </TableCell>                   
              </template> 

              <template v-slot:cell-mobile="{ item }">
                  <TableCell 
                      :cellvalue="item.mobile"
                      :record="item" 
                      cellkey="mobile" 
                      @changed="handleCellChange"
                  >                        
                      {{ item.mobile }}
                  </TableCell>                   
              </template>     
              
              <template v-slot:cell-category="{ item }">
                    <TableCell 
                        :cellvalue="customerCategories.find(option => option.id === item.category?.id)"
                        :record="item" 
                        :options="customerCategories"
                        type="list"
                        cellkey="category" 
                        @changed="handleCellChange"
                    >                        
                        {{ item.category?.name }}
                    </TableCell>                   
                </template>
                
                <template v-slot:cell-owner="{ item }">
                  <TableCell 
                      :cellvalue="users.find(option => option.id === item.owner?.id)"
                      :record="item" 
                      :options="users"
                      selectLabel="name"
                      type="list"
                      cellkey="owner" 
                      @changed="handleCellChange"
                  >                        
                      {{ item.owner?.name }}
                  </TableCell>                   
              </template>  
              
              <template v-slot:cell-customer_status="{ item }">
                    <TableCell 
                        :cellvalue="item.customer_status"
                        :record="item" 
                        :options="customerStatuses"
                        type="list"
                        cellkey="customer_status" 
                        @changed="handleCellChange"
                    >                        
                        {{ item.customer_status }}
                    </TableCell>                   
                </template>
              
          </Table>
      </template>
  </Page>
</template>

<script setup>

import {trans} from "@/helpers/i18n";
import CustomerService from "@/services/CustomerService";
import UserService from "@/services/UserService";
import {watch, onMounted, defineComponent, reactive, ref, defineAsyncComponent } from 'vue';
import {getResponseError, prepareQuery} from "@/helpers/api";
import {toUrl} from "@/helpers/routing";
import {useAlertStore} from "@/stores";
import alertHelpers from "@/helpers/alert";
import Page from "@/views/layouts/Page";
import Table from "@/views/components/Table";
import TableCell from "@/views/components/table/TableCell";
import Avatar from "@/views/components/icons/Avatar";
import Filters from "@/views/components/filters/Filters";
import FiltersRow from "@/views/components/filters/FiltersRow";
import FiltersCol from "@/views/components/filters/FiltersCol";
import TextInput from "@/views/components/input/TextInput";
import Dropdown from "@/views/components/input/Dropdown";
import {customerCategories} from "@/stub/categories";
import { customerStatuses } from "@/stub/statuses";
import {clearObject, removeEmpty} from "@/helpers/data";

const service = new CustomerService();
const userService = new UserService();
const alertStore = useAlertStore();
let users = null;

const mainQuery = reactive({
  page: 1,
  search: '',
  sort: '',
  filters: {
      search: {
          value: '',
          comparison: '='
      },              
      role: {
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
});

const table = reactive({
  headers: {
      name: trans('global.labels.name'),
      email: trans('global.labels.email'),
      mobile: trans('customers.labels.mobile'),
      category: trans('global.labels.category'),
      owner: trans('global.labels.owner'),
      customer_status: trans('customers.labels.customer_status'),
  },
  sorting: {
      name: true,
      email: true
  },
  columns: [
      {
          key: 'name',
          label: trans('global.labels.name'),
          editable: true,
          sorteable: true
      },
      {
          key: 'email',
          label: trans('global.labels.email'),
          sorteable: true
      },    
      {
          key: 'mobile',
          label: trans('customers.header.phone'),
          sorteable: false
      },    
      {
          key: 'category',
          label: trans('customers.labels.category'),
          sorteable: false,
      },    
      {
          key: 'owner',
          label: trans('global.labels.owner'),
          sorteable: false
      },    
      {
          key: 'customer_status',
          label: trans('customers.labels.customer_status'),
          sorteable: false
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
  records: null,
  editableFields: {
      name: {
          type: 'input'
      }
  }
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

function handleCellChange(payload) {
  let record = table.records.find((item) => item.id == payload.record.id);
//   record = removeEmpty(record);

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
  service.handleUpdate(page.id, record.id, removeEmpty(record));
}

watch(mainQuery, (newTableState) => {
  fetchPage(mainQuery);
});

onMounted(async () => {
  users = await userService.list().then(res => res.data);
  fetchPage(mainQuery);
});

</script>
