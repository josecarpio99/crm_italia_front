<template>
  <Page 
    :title="page.title" 
    :breadcrumbs="page.breadcrumbs" 
    :actions="page.actions" 
    @action="onPageAction"
    :showFooter="page.showFooter"
    :displayTopMenu="true"
    :is-loading="page.isLoading"
    :key="pageKey"
  >      
      <template #top-menu> 
        <div class="flex gap-4">
            <div class="basis-1/4">
                <h4 class="text-xl text-gray-600 mb-4">{{ trans('global.labels.work_list') }}</h4>
                
                <router-link 
                  v-for="item in smartLists" 
                  :key="route.fullPath"
                  class="p-6 border-2 block rounded-sm cursor-pointer hover:shadow-xl"
                  :class="{'border-blue-300': !route.params.id}"
                  :to="{name: 'customers.list'}"
                >
                  <h4 class="text-2xl">{{ trans('global.pages.customer') }}</h4>
                </router-link>

            </div>
            <div class="basis-3/4">
                <h4 class="text-xl text-gray-600 mb-4">{{ trans('global.labels.smart_lists') }}</h4>
                <div v-if="smartLists.length > 0" class="flex flex-wrap gap-4">
                    <router-link 
                    v-for="item in smartLists" 
                    :key="route.fullPath"
                    class="p-6 border-2 grow-0 rounded-sm basis-[31%]  hover:shadow-xl cursor-pointer"
                    :class="{'border-blue-300': route.params.id == item.id}"
                    :to="{name: 'customers.list', params: {id: item.id}}"
                    >                      
                      <h4 class="text-2xl">{{ item.name }}</h4> 
                    </router-link>

                </div>

                <div v-else class="flex items-center justify-center p-10">
                  <span class="text-lg text-gray-500">{{ trans('global.phrases.no_records') }}</span>
                </div>
            </div>
        </div>
      </template>

      <template #default>
          <Table :id="page.id" v-if="table" :columns="table.columns" :records="table.records" :pagination="table.pagination" :is-loading="table.loading" @page-changed="onTablePageChange" @action="onTableAction" @sort="onTableSort" @filter="onTableFilter" @cell-change="onCellChange">
            <template #cell-name="{item}">
              <router-link 
                class="font-semibold hover:text-blue-700 hover:underline"
                :to="{name: 'customers.show', params: {id: item.id}}"
              >
                <Icon 
                  v-if="item.name" 
                  class="mr-2 text-xl align-middle text-gray-500" 
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

import {useRoute} from "vue-router";
import router from "@/router";
import {trans} from "@/helpers/i18n";
import CustomerService from "@/services/CustomerService";
import SmartListService from "@/services/SmartListService";
import {watch, onMounted, onBeforeMount, reactive, ref } from 'vue';
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

const route = useRoute();
const service = new CustomerService();
const smartListservice = new SmartListService();
const alertStore = useAlertStore();
const usersStore = useUsersStore();

const pageKey = ref(0);
let users = usersStore.userList;
let smartList = null;
let smartLists =  [];

const mainQueryInitialState = {
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
      status: {
          value: '',
          comparison: '='
      },   
      category_id: {
          value: '',
          comparison: '='
      }
  }
};

const mainQuery = reactive({...mainQueryInitialState});

const page = reactive({
  id: 'list_customers',
  title: '',
  breadcrumbs: [
      {
          name: trans('global.pages.customers'),
          to: toUrl('/customers'),
          active: true,
      }
  ],  
  toggleFilters: false,
  showFooter: true,
  isLoading: false
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
          key: 'status',
          cellLabel: 'customer_status',
          label: trans('customers.labels.customer_status'),
          sorteable: false,
          filterable: true,
          editable: true,
          filter: {
            modelValue:'',
            type: 'select',
            options: customerStatuses,
            type: 'multiselect'
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

function fetchSmartList(id) {
  smartListservice.find(id).then((res) => {
    smartList = res.data.data;
    if (smartList.resource_type != 'customer') {
      router.push({name: 'notFound', params: {pathMatch: 'not-found' }});        
    }

    Object.assign(mainQuery, smartList.definition.query);

    page.title = smartList.name;

    const {owner: ownerFilter, status: statusFilter, name: nameFilter, category_id: categoryIdFilter} = smartList.definition.query.filters;

    if (nameFilter.value != '') {      
      let nameColumn = table.columns.find(column => column.key == 'name');
      nameColumn.filter.modelValue = nameFilter.value;         
    }

    if (categoryIdFilter.value != '') {  
      let selectedcategory = customerCategories.find(option => option.id == categoryIdFilter.value);
      
      let categoryIdColumn = table.columns.find(column => column.key == 'category');
      categoryIdColumn.filter.modelValue = selectedcategory;         
    }

    if (ownerFilter.value != '') {
      let selectedUsers = ownerFilter.value.split(',').map(item => {
        return users.find(option => option.id == item);
      });
      
      let ownerColumn = table.columns.find(column => column.key == 'owner');
      ownerColumn.filter.modelValue = selectedUsers;         
    }

    if (statusFilter.value != '') {
      let selectedStatuses = statusFilter.value.split(',').map(item => {
        return customerStatuses.find(option => option.id == item);
      });
      
      let statusColumn = table.columns.find(column => column.key == 'status');
      statusColumn.filter.modelValue = selectedStatuses;         
    } 
  })
  .catch(error =>{
    console.log(error);
    if (error.response?.status == 404) {
      router.push({name: 'notFound', params: {pathMatch: 'not-found' }})
    }
  })
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
  } else if (payload.key == 'status') {
    record.customer_status = payload.value.id;   
  }
   else {
    record[payload.key] = typeof payload.value == 'object' ? payload.value.id : payload.value.toString(); 
  }
  
  service.handleUpdate(page.id, record.id, removeEmpty(record))
    .then((res) => {     
        if (res.response?.status >= 400) {            
            Object.assign(record, oldRecord);
        } else {
          if ((payload.key == 'status')) {
            fetchPage(mainQuery);
          }
        }
    });
}

function onTableFilter({column, value}) {
    if (column.key == 'owner') {
        mainQuery.filters[column.key].value = value.map(item => item.id).join(',');
    }
    else if (column.key == 'status') {
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

watch(() => route.params, async (toParams, previousParams) => {
  pageKey.value++;
  page.isLoading = true;
  if (route.params.id) {
    await fetchSmartList(route.params.id);
  } else {
    page.title = trans('global.pages.customers');

    Object.assign(mainQuery, mainQueryInitialState);
  }
  page.isLoading = false;
});

onMounted(async () => {
  smartLists = await smartListservice.index({'filter[resource_type]': 'customer'}).then(res => res.data.data);  

  let ownerColumn = table.columns.find(column => column.key == 'owner');
  ownerColumn.filter.options = users;
  ownerColumn.edit.options = users;

  fetchPage(mainQuery);
});

onBeforeMount(async () => {
  if (!route.params.id) {
    page.title = trans('global.pages.customers');
    return;
  } 
  page.isLoading = true;
  await fetchSmartList(route.params.id);
  page.isLoading = false;
  
});

</script>
