<template>
  <Page 
    :title="page.title" 
    :breadcrumbs="page.breadcrumbs" 
    :actions="page.actions" 
    @action="onPageAction"
    :showFooter="page.showFooter"
    :displayTopMenu="true"
    :is-loading="page.isLoading"
    :title-editable="smartList ? true : false"
    @title-change="updateSmartListName"
  >      
     <template #top-menu> 
        <div class="flex gap-4">
            <div class="basis-1/4">
                <h4 class="text-xl text-gray-600 mb-4">{{ trans('global.labels.work_list') }}</h4>
                
                <router-link 
                  class="p-6 border-2 block rounded-sm cursor-pointer hover:shadow-xl"
                  :class="{'border-blue-300': !route.params.id}"
                  :to="{name: 'deals.oportunidades.list'}"
                >
                  <h4 class="text-2xl">{{ trans('global.pages.oportunidad') }}</h4>
                </router-link>

            </div>
            <div class="basis-3/4">
                <SmartLists
                  :items="smartLists"
                  :routeName="'deals.oportunidades.list'"
                />                
            </div>
        </div>
      </template>

      <template #beside-title>
        <div v-if="!page.isLoading" class="flex ml-4">
          <Button
            v-if="!smartList"
            theme="outline"
            :label="trans('global.buttons.save_smart_list')"
            @click="showSmartListModal = true"
          />

          <template v-else >
            <div v-if="queryHasChange">
              <Button
                class="mr-3"
                theme="transparent"
                :label="trans('global.buttons.discard_changes')"
                @click="discarChanges"
              />

              <Button
                class="mr-2"
                theme="submit"
                :label="trans('global.buttons.save')"
                @click="updateSmartList"
              />
            </div>

            <VDropdown 
              placement="right"
            >
              <button>
                <Icon class="text-gray-500 align-sub text-lg hover:text-gray-700 cursor-pointer px-2" name="ellipsis-v" />
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
          </template>
          
        </div>
      </template>

      <template #default>
          <Table :id="page.id" :key="tableKey" v-if="table" :columns="table.columns" :records="table.records" :pagination="table.pagination" :is-loading="table.loading" @page-changed="onTablePageChange" @action="onTableAction" @sort="onTableSort" @filter="onTableFilter" @cell-change="onCellChange">

            <template #cell-deal="{item}">
              <router-link 
                class="font-semibold hover:text-blue-700 hover:underline"
                :to="{name: 'deals.oportunidades.show', params: {id: item.id}}"
              >
                <Icon v-if="item.name" class="mr-2 text-gray-500 text-xl align-middle" name="plus-square-o" />
                {{ item.name}}
              </router-link>
            </template>

            <template #cell-value="{item}">
              {{ 'MXN' + item.value?.toLocaleString('en-US') }}
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
import DealService from "@/services/DealService";
import {watch, onMounted, defineComponent, reactive, ref, defineAsyncComponent } from 'vue';
import {getResponseError, prepareQuery} from "@/helpers/api";
import {toUrl} from "@/helpers/routing";
import {useAlertStore} from "@/stores";
import alertHelpers from "@/helpers/alert";
import $date from "@/helpers/date";
import Icon from "@/views/components/icons/Icon";
import Page from "@/views/layouts/Page";
import SmartLists from "@/views/components/SmartLists";
import SmartListModal from "@/views/components/SmartListModal";
import Table from "@/views/components/Table";
import Button from "@/views/components/input/Button";
import CircleAvatarIcon from "@/views/components/icons/CircleAvatar";
import Filters from "@/views/components/filters/Filters";
import FiltersRow from "@/views/components/filters/FiltersRow";
import FiltersCol from "@/views/components/filters/FiltersCol";
import TextInput from "@/views/components/input/TextInput";
import Dropdown from "@/views/components/input/Dropdown";
import {clearObject, removeEmpty, numberFormatter} from "@/helpers/data";
import { datesFilter } from "@/stub/date";
import {useUsersStore} from "@/stores/users";
import {useSourcesStore} from "@/stores/sources";
import {useAuthStore} from "@/stores/auth";
import toast from '@/helpers/toast';

const route = useRoute();
const dealService = new DealService();
const customerService = new CustomerService();
const smartListservice = new SmartListService();
const alertStore = useAlertStore();
const usersStore = useUsersStore();
const sourcesStore = useSourcesStore();
const authStore = useAuthStore();

const tableKey = ref(1);
const queryHasChange = ref(false);
const showSmartListModal = ref(false);
let users = usersStore.userList;
let sources = sourcesStore.sourceList;
let smartList = null;
let smartLists =  [];

const mainQuery = reactive({
  page: 1,
  limit: 'all',
  search: '',
  sort: '',
  filters: {
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
  id: 'list_deals',
  title: '',
  breadcrumbs: [
      {
          name: trans('global.pages.deals'),
          to: toUrl('/deals'),
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
          key: 'deal',
          label: trans('global.pages.deal')
      },   
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
          filterable: true,
          filter: {
            modelValue: {
              minValue: null,
              maxValue: null
            },
            type: 'range'
          },       
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
          filterable: true,
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
    record.category_id = payload.value.id;
    record.category = {
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
    if (column.key == 'owner' || column.key == 'source') {
      mainQuery.filters[column.key].value = (value) ? value.map(item => item.id).join(',') : '';
    } else if (column.key == 'created_at') {
      mainQuery.filters['created_at'].value = value?.id;
    } else if (column.key == 'category') {
      mainQuery.filters['category_id'].value = value;
    } else if (column.key == 'value') {  
      let newValue = (!value.minValue && !value.maxValue) ? '' : `${value.minValue ?? 0},${value.maxValue ?? 0}`;    
      mainQuery.filters['value'].value = newValue;
    } 
    else {
        mainQuery.filters[column.key].value = value;
    }
}

function fetchSmartList(id) {
  smartListservice.find(id).then((res) => {
    smartList = res.data.data;
    if (smartList.resource_type != 'oportunidad') {
      router.push({name: 'notFound', params: {pathMatch: 'not-found' }});        
    }

    page.title = smartList.name;

    Object.assign(mainQuery, structuredClone(smartList.definition.query));

    updateColumnsForSmartList();
  })
  .catch(error =>{
    console.log(error);
    if (error.response?.status == 404) {
      router.push({name: 'notFound', params: {pathMatch: 'not-found' }})
    }
  })
}

function updateColumnsForSmartList() {
  const {
    owner: ownerFilter, 
    source: sourceFilter, 
    name: nameFilter,
    created_at: createdAtFilter,
    value: valueFilter,
  } = smartList.definition.query.filters;

  if (nameFilter.value) {      
    let nameColumn = table.columns.find(column => column.key == 'name');
    nameColumn.filter.modelValue = nameFilter.value;         
  }

  if (valueFilter.value) {      
    let [minValue, maxValue] = valueFilter.value.split(',');

    let valueColumn = table.columns.find(column => column.key == 'value');
    valueColumn.filter.modelValue = {
      minValue,
      maxValue
    };    
  }

  if (createdAtFilter.value) { 
    let selectedDate = datesFilter.find(option => option.id == createdAtFilter.value);
    
    let createdAtColumn = table.columns.find(column => column.key == 'created_at');
    createdAtColumn.filter.modelValue = selectedDate;         
  }   

  if (sourceFilter.value) {
    let selectedSources = sourceFilter.value.split(',').map(item => {
      return sources.find(option => option.id == item);
    });
    
    let sourceColumn = table.columns.find(column => column.key == 'source');
    sourceColumn.filter.modelValue = selectedSources;         
  }

  if (ownerFilter.value) {
    let selectedUsers = ownerFilter.value.split(',').map(item => {
      return users.find(option => option.id == item);
    });
    
    let ownerColumn = table.columns.find(column => column.key == 'owner');
    ownerColumn.filter.modelValue = selectedUsers;         
  }   
}

function onSmartListSave({name}) {
  smartListservice.store({
    name,
    user_id: authStore.user.id,
    resource_type: 'oportunidad',    
    definition: {
      'query': {...mainQuery}
    } 
  }).then(res => {
    if (res.status == 200 || res.status == 201) {
      toast.success();
      router.push({name: 'deals.oportunidades.list', params: {id: res.data.data.id}})
    }
  });
}

function deleteSmartList() {
  alertHelpers.confirmDanger(function () {
    smartListservice.delete(smartList.id).then(function (response) {
      router.push({name: 'deals.oportunidades.list'});
    });
  })
}

function discarChanges() {
  Object.assign(mainQuery, structuredClone(smartList.definition.query));
  updateColumnsForSmartList();
  tableKey.value++;
}

function updateSmartList(updateQueryHasChange = true, updateDefinition = true) {
  if (updateQueryHasChange) {
    queryHasChange.value = false;    
  }

  smartListservice.update(smartList.id, {
    name: smartList.name,
    user_id: smartList.user_id,
    resource_type: smartList.resource_type,    
    definition: updateDefinition ? {
      'query': {...mainQuery}
    } : smartList.definition
  }).then(res => {
    if (res.status == 200 || res.status == 201) {
      smartList = res.data.data;
      toast.success();
    }
  });
}

function updateSmartListName({value}) {
  smartList.name = value;
  page.title = value;
  updateSmartList(false, false);  
}

watch(mainQuery, (newTableState) => {
  if (smartList) {
    queryHasChange.value = _.isEqual(mainQuery, smartList.definition.query) ? false : true;
  }
  fetchPage(mainQuery);
});

onMounted(async () => {
  page.isLoading = true;
  if (!route.params.id) {
    page.title = trans('deals.menu.oportunidades');
  } else {
    await fetchSmartList(route.params.id);
  }

  smartLists = await smartListservice.index({'filter[resource_type]': 'oportunidad'}).then(res => res.data.data);  


  let ownerColumn = table.columns.find(column => column.key == 'owner');
  let sourceColumn = table.columns.find(column => column.key == 'source');

  ownerColumn.filter.options = users;
  ownerColumn.edit.options = users;

  sourceColumn.filter.options = sources;
  sourceColumn.edit.options = sources;

  page.isLoading = false;
  fetchPage(mainQuery);
});

</script>
