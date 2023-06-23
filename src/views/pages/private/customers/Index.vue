<template>
  <Page 
    :title="page.title" 
    :breadcrumbs="page.breadcrumbs" 
    :actions="page.actions" 
    @action="onPageAction"
    :showFooter="page.showFooter"
    :displayTopMenu="true"
    :is-loading="page.isLoading"
  >      
      <template #top-menu> 
        <div class="flex gap-4">
            <div class="basis-1/4">
                <h4 class="text-xl text-gray-600 mb-4">{{ trans('global.labels.work_list') }}</h4>
                
                <router-link 
                  class="p-6 border-2 block rounded-sm cursor-pointer hover:shadow-xl"
                  :class="{'border-blue-300': !route.params.id}"
                  :to="{name: 'customers.list'}"
                >
                  <h4 class="text-2xl">{{ trans('global.pages.customer') }}</h4>
                </router-link>

            </div>
            <div class="basis-3/4">
                <SmartLists
                  :items="smartLists"
                  :routeName="'customers.list'"
                />                
            </div>
        </div>
      </template>

      <template #beside-title>
        <div v-if="!page.isLoading" class="inline-block ml-4">
          <Button
            v-if="!smartList"
            theme="outline"
            :label="trans('global.buttons.save_smart_list')"
            @click="showSmartListModal = true"
          />

          <VDropdown 
            v-else
            placement="right"
          >
            <button>
              <Icon class="text-gray-500 hover:text-gray-700 cursor-pointer px-2" name="ellipsis-v" />
            </button>

            <template #popper>
              <ul>
                <li 
                  class="py-2 px-4 cursor-pointer text-red-500 hover:bg-gray-100"
                  @click="deleteSmartList"
                >
                  {{ trans('global.actions.delete') }}
                </li>
              </ul>
            </template>
          </VDropdown>
          
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

            <template #cell-created_at="{item}">            
                {{ $date(item.created_at).format() }}          
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
  <SmartListModal 
    :modalActive="showSmartListModal" 
    @close-modal="showSmartListModal = false" 
    @save-modal="onSmartListSave"
  />

</template>

<script setup>

import _ from "lodash";
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
import $date from "@/helpers/date";
import Icon from "@/views/components/icons/Icon";
import CircleAvatarIcon from "@/views/components/icons/CircleAvatar";
import Page from "@/views/layouts/Page";
import SmartLists from "@/views/components/SmartLists";
import SmartListModal from "@/views/components/SmartListModal";
import Table from "@/views/components/Table";
import Button from "@/views/components/input/Button";
import Avatar from "@/views/components/icons/Avatar";
import Filters from "@/views/components/filters/Filters";
import FiltersRow from "@/views/components/filters/FiltersRow";
import FiltersCol from "@/views/components/filters/FiltersCol";
import TextInput from "@/views/components/input/TextInput";
import Dropdown from "@/views/components/input/Dropdown";
import {customerCategories} from "@/stub/categories";
import { datesFilter } from "@/stub/date";
import { customerStatuses } from "@/stub/statuses";
import {clearObject, removeEmpty} from "@/helpers/data";
import {useUsersStore} from "@/stores/users";
import {useAuthStore} from "@/stores/auth";
import toast from '@/helpers/toast';

const route = useRoute();
const service = new CustomerService();
const smartListservice = new SmartListService();
const alertStore = useAlertStore();
const usersStore = useUsersStore();
const authStore = useAuthStore();

const queryHasChange = ref(false);
const showSmartListModal = ref(false);
let users = usersStore.userList;
let smartList = null;
let smartLists =  [];

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
          value: '',
          comparison: '='
      },
      status: {
          value: '',
          comparison: '='
      },   
      category_id: {
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
      {
          key: 'created_at',
          label: trans('customers.labels.created_at'),
          sorteable: true,
          filterable: true,
          editable: false,
          filter: {
            modelValue:'',
            type: 'select',
            options: datesFilter
          }          
      }, 
  ],           
  pagination: {
      meta: null,
      links: null,
  },
  actions: {
      
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

    page.title = smartList.name;

    Object.assign(mainQuery, structuredClone(smartList.definition.query));

    const {
      owner: ownerFilter, 
      status: statusFilter, 
      name: nameFilter, 
      category_id: categoryIdFilter,
      created_at: createdAtFilter,
    } = smartList.definition.query.filters;

    if (nameFilter.value) {      
      let nameColumn = table.columns.find(column => column.key == 'name');
      nameColumn.filter.modelValue = nameFilter.value;         
    }

    if (createdAtFilter.value) { 
      let selectedDate = datesFilter.find(option => option.id == createdAtFilter.value);
      
      let createdAtColumn = table.columns.find(column => column.key == 'created_at');
      createdAtColumn.filter.modelValue = selectedDate;         
    }    

    if (categoryIdFilter.value) {  
      let selectedcategory = customerCategories.find(option => option.id == categoryIdFilter.value);
      
      let categoryIdColumn = table.columns.find(column => column.key == 'category');
      categoryIdColumn.filter.modelValue = selectedcategory;         
    }

    if (ownerFilter.value) {
      let selectedUsers = ownerFilter.value.split(',').map(item => {
        return users.find(option => option.id == item);
      });
      
      let ownerColumn = table.columns.find(column => column.key == 'owner');
      ownerColumn.filter.modelValue = selectedUsers;         
    }

    if (statusFilter.value) {
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
    else if (column.key == 'created_at') {
        mainQuery.filters['created_at'].value = value?.id;
    } 
    else if (column.key == 'category') {
        mainQuery.filters['category_id'].value = value;
    } 
    else {
        mainQuery.filters[column.key].value = value;
    }
}

function onSmartListSave({name}) {
  smartListservice.store({
    name,
    user_id: authStore.user.id,
    resource_type: 'customer',    
    definition: {
      'query': {...mainQuery}
    } 
  }).then(res => {
    if (res.status == 200 || res.status == 201) {
      toast.success();
      router.push({name: 'customers.list', params: {id: res.data.data.id}})
    }
  });
}

function deleteSmartList() {
  alertHelpers.confirmDanger(function () {
    smartListservice.delete(smartList.id).then(function (response) {
      router.push({name: 'customers.list'});
    });
  })
}

watch(mainQuery, (newTableState) => {
  if (smartList) {
    queryHasChange.value = _.isEqual(mainQuery, smartList.definition.query) ? false : true; 
    console.log(queryHasChange.value);
  }
  fetchPage(mainQuery);
});

onMounted(async () => {
  page.isLoading = true;
  if (!route.params.id) {
    page.title = trans('global.pages.customers');
  } else {
    await fetchSmartList(route.params.id);
  }

  smartLists = await smartListservice.index({'filter[resource_type]': 'customer'}).then(res => res.data.data);  

  let ownerColumn = table.columns.find(column => column.key == 'owner');
  ownerColumn.filter.options = users;
  ownerColumn.edit.options = users;
  
  page.isLoading = false;
  fetchPage(mainQuery);
});

</script>
