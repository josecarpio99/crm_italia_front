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

      <template #beside-title v-if="!authStore.isDirector()">
        <div v-if="!page.isLoading" class="flex ml-4">
          <Button
            v-if="!smartList"
            class="mb-2"
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

      <template #page-actions>
        <div class="flex items-center">
          <FieldsButton
            :columns="table.columns"
            @update="onFieldsChange"
          />
        </div>
      </template>

      <template #under-top>
        <div class="hidden lg:grid grid-cols-11 bg-white" v-if="authStore.isDirector() && table.pagination.meta">

          <div class="grid grid-cols-5 col-span-3 bg-white place-content-center px-4 py-6 border-r-2">
            
            <div class="flex flex-col items-center col-span-2">
              <span class="font-bold text-xl text-gray-700">Total Estimado</span>
              <span class="font-semibold text-xl text-gray-500">{{ '$' + table.pagination.meta.valueSum.toLocaleString('en-US') }}</span>
            </div>
            <div class="flex flex-col items-center col-span-3">
              <span class="font-bold text-xl text-gray-700">Número Oportunidades</span>
              <span class="font-semibold text-xl text-gray-500">{{ table.pagination.meta.total }}</span>
            </div>
          
          </div>          

          <div class="grid grid-cols-2 col-span-2 place-content-center px-[.25rem] py-6 border-r-2">

            <div class="flex flex-col items-center">
              <span class="font-semibold text-sm text-gray-700">De las cuales AGS.</span>
              <span class="font-semibold text-sm text-gray-600">{{ '$' + table.pagination.meta.branch.AGS.sum.toLocaleString('en-US') }}</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="font-semibold text-sm text-gray-700">Núm. Oportunidades</span>
              <span class="font-semibold text-sm text-gray-600">{{ table.pagination.meta.branch.AGS.count }}</span>
            </div>
          
          </div>

          <div class="grid grid-cols-2 col-span-2 place-content-center px-[.25rem] py-6 border-r-2">

          <div class="flex flex-col items-center">
            <span class="font-semibold text-sm text-gray-700">De las cuales CDMX.</span>
            <span class="font-semibold text-sm text-gray-600">{{ '$' + table.pagination.meta.branch.CDMX.sum.toLocaleString('en-US') }}</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="font-semibold text-sm text-gray-700">Núm. Oportunidades</span>
            <span class="font-semibold text-sm text-gray-600">{{ table.pagination.meta.branch.CDMX.count }}</span>
          </div>

          </div>

          <div class="grid grid-cols-2 col-span-2 place-content-center px-[.25rem] py-6 border-r-2">

            <div class="flex flex-col items-center">
              <span class="font-semibold text-sm text-gray-700">De las cuales MTY.</span>
              <span class="font-semibold text-sm text-gray-600">{{ '$' + table.pagination.meta.branch.MTY.sum.toLocaleString('en-US') }}</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="font-semibold text-sm text-gray-700">Núm. Oportunidades</span>
              <span class="font-semibold text-sm text-gray-600">{{ table.pagination.meta.branch.MTY.count }}</span>
            </div>
          
          </div>

          <div class="grid grid-cols-2 col-span-2 place-content-center px-[.25rem] py-6">

            <div class="flex flex-col items-center">
              <span class="font-semibold text-sm text-gray-700">De las cuales QRO.</span>
              <span class="font-semibold text-sm text-gray-600">{{ '$' + table.pagination.meta.branch.QRO.sum.toLocaleString('en-US') }}</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="font-semibold text-sm text-gray-700">Núm. Oportunidades</span>
              <span class="font-semibold text-sm text-gray-600">{{ table.pagination.meta.branch.QRO.count }}</span>
            </div>
          
          </div>

          </div>
        <!-- <div class="flex items-center bg-white px-2 py-4" v-if="authStore.isDirector() && table.pagination.meta">          
          <div class="flex ml-14 gap-10 text-sm uppercase w-full lg:w-[700px] text-gray-600 tracking-tight">
            <div class="flex items-center">
              <span class="">Oportunidades totales</span>
              <span class="ml-2 text-xl font-semibold text-gray-500 tracking-tight">{{ table.pagination.meta.total }}</span>
            </div>
            <div class="flex items-center">
              <span class="">Total importe estimado</span>
              <span class="ml-2 text-xl font-semibold text-gray-500 tracking-tight">
                {{ '$' + table.pagination.meta.estimatedSizeSum.toLocaleString('en-US') }}
              </span>
            </div>
            <div class="flex items-center">
              <span class="">Totales clientes AAA</span>
              <span class="ml-2 text-xl font-semibold text-gray-500 tracking-tight">
                {{ table.pagination.meta.AAA_customers }}
              </span>
            </div>
          </div>
        </div> -->
      </template>

      <template #default>            

          <Table :id="page.id" :key="tableKey" v-if="table" :columns="table.columns" :records="table.records" :pagination="table.pagination" :is-loading="table.loading" @page-changed="onTablePageChange" @action="onTableAction" @sort="onTableSort" @filter="onTableFilter" @cell-change="onCellChange" @moved="onColumnMoved" @scroll-end="onScrollEnd" :infinite-scroll="true" :clickeable-row="table.clickeableRow" @row-click="handleRowClick">

            <template #cell-deal="{item}">
              <router-link 
                class="font-semibold hover:text-blue-700 hover:underline"
                :to="{name: 'deals.oportunidades.show', params: {id: item.id}}"
              >
                <Icon v-if="item.name" class="mr-2 text-gray-500 text-xl align-middle" name="sign-in" />
                {{ item.name}}
              </router-link>
            </template>

            <template #cell-value="{item}">
              <span 
                class="text-gray-600 font-bold p-2 rounded-lg"
                :class="{
                  'bg-pink-100': item.value <= 500_000,
                  'bg-blue-200': item.value > 500_000 && item.value <= 3_000_000,
                  'bg-green-200': item.value > 3_000_000 && item.value <= 6_000_000,
                  'bg-yellow-200': item.value > 6_000_000
                }"
              >
                {{ 'MXN' + item.value?.toLocaleString('en-US') }}
              </span>              
            </template>

            <template #cell-stage="{item}">
              <PipelineStage :stage-id="item.stage.id" />
            </template>

            <template #cell-owner="{item}">             
              <CircleAvatarIcon :avatarUrl="item.owner?.avatar_url" />               
              {{ item.owner?.name }}
            </template>

            <template #cell-has_project_manager="{item}">                  
              {{ item.has_project_manager ? 'Si' : 'No' }}
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
import {watch, onMounted, defineComponent, reactive, ref, defineAsyncComponent, computed } from 'vue';
import {getResponseError, prepareQuery} from "@/helpers/api";
import {toUrl} from "@/helpers/routing";
import {useAlertStore} from "@/stores";
import alertHelpers from "@/helpers/alert";
import $date from "@/helpers/date";
import Icon from "@/views/components/icons/Icon";
import Page from "@/views/layouts/Page";
import SmartLists from "@/views/components/SmartLists";
import SmartListModal from "@/views/components/SmartListModal";
import FieldsButton from "@/views/components/FieldsButton";
import Table from "@/views/components/Table";
import PipelineStage from "@/views/components/PipelineStage";
import Button from "@/views/components/input/Button";
import CircleAvatarIcon from "@/views/components/icons/CircleAvatar";
import Filters from "@/views/components/filters/Filters";
import FiltersRow from "@/views/components/filters/FiltersRow";
import FiltersCol from "@/views/components/filters/FiltersCol";
import TextInput from "@/views/components/input/TextInput";
import Dropdown from "@/views/components/input/Dropdown";
import {clearObject, removeEmpty, numberFormatter} from "@/helpers/data";
import {oportunidadColumns} from "@/stub/columns";
import { datesFilter } from "@/stub/date";
import { PAGE_LIMIT } from "@/stub/constans";
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
  limit: PAGE_LIMIT,
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
      stage: {
          value: '',
          comparison: '='
      },    
      owner: {
          value: '',
          comparison: '='
      },
      branch: {
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
          name: trans('global.pages.oportunidades'),
          to: toUrl('/deals'),
          active: true,
      }
  ],  
  toggleFilters: false,
  showFooter: !authStore.isDirector(),
  isLoading: false
});

const table = reactive({ 
  columns: oportunidadColumns,           
  pagination: {
      meta: null,
      links: null,
  },
  loading: true,
  clickeableRow: true,
  records: []  
})  

const selectedFields = computed(() => table.columns.filter(item => item.show).map(item => item.key));

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
  // table.records = [];
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

  if (record.customer?.category) {
    record.customer.category_id = record.customer.category?.id;    
  }

  if (payload.key == 'category') {
    record.category_id = payload.value.id;
    record.category = {
        id: payload.value.id,
        name: payload.value.label
    };
  } else if (payload.key == 'source') {
    record.source_id = payload.value.id;
    record.source = {
        id: payload.value.id,
        name: payload.value.name
    };  
  } else if (payload.key == 'stage') {
    record.deal_pipeline_stage_id = payload.value.id;
    record.stage = {
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
    if (column.key == 'owner' || column.key == 'source' || column.key == 'stage' || column.key == 'branch') {
      mainQuery.filters[column.key].value = (value) ? value.map(item => item.id).join(',') : null;
    } else if (column.key == 'created_at') {
      mainQuery.filters['created_at'].value = value?.id || null;
    } else if (column.key == 'category') {
      mainQuery.filters['category_id'].value = value || null;
    } else if (column.key == 'value') {  
      let newValue = (!value.minValue && !value.maxValue) ? null : `${value.minValue ?? 0},${value.maxValue ?? 0}`;    
      mainQuery.filters['value'].value = newValue;
    } 
    else {
        mainQuery.filters[column.key].value = value || null;
    }

    let _column = table.columns.find(tableColumn => tableColumn.key == column.key);
    
    _column.filter.modelValue = value;
}

function fetchSmartList(id) {
  smartListservice.find(id).then((res) => {
    smartList = res.data.data;
    if (smartList.resource_type != 'oportunidad') {
      router.push({name: 'notFound', params: {pathMatch: 'not-found' }});        
    }

    page.title = smartList.name;

    Object.assign(mainQuery, structuredClone(smartList.definition.query));

    setColumnsForSmartList();
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
      'query': {
        ...mainQuery,
        page: 1
      },
      'fields': selectedFields.value
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
  setColumnsForSmartList();
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
      'query': {...mainQuery},
      'fields': selectedFields.value 

    } : smartList.definition
  }).then(res => {
    if (res.status == 200 || res.status == 201) {
      smartList = res.data.data;
      toast.success();
    }
  });
}

function setColumnsForSmartList() {
  let remainingColumns = table.columns
    .filter(column => !smartList.definition.fields.includes(column.key))

  remainingColumns.forEach(column => column.show = false);

  let selectedColumns = smartList.definition.fields.map(field => {
      return table.columns.find(column => column.key == field)
    })

  selectedColumns.forEach(column => column.show = true);

  table.columns = selectedColumns.concat(remainingColumns);
}

function updateSmartListName({value}) {
  smartList.name = value;
  page.title = value;
  updateSmartList(false, false);  
}

function onColumnMoved({columns}) { 
  let remainingColumns = table.columns.filter(column => !column.show);

  let selectedColumns = columns.map(columnMoved => {
    return table.columns.find(column => column.key == columnMoved.key);
  })
  
  table.columns = selectedColumns.concat(remainingColumns);
  // table.columns = columns;
  if (smartList) {
    checkIfTableChange();
  }
  tableKey.value++;
}

function onFieldsChange({columns}) {
  table.columns = columns;
  if (smartList) {
    checkIfTableChange();
  }
  resetQueryOfRemovedColumns();
  tableKey.value++;
}

function resetQueryOfRemovedColumns() {
  table.columns.forEach(column => {
    if (!column.show) {
      if (mainQuery.filters[column.key]) {
        if (column.key == 'category') {
          mainQuery.filters.category_id.value = '';
        } else {
          mainQuery.filters[column.key].value = '';  
        }
        column.filter.modelValue = null;
      }
    }   
  });
}

function checkIfTableChange() {
  queryHasChange.value = (
    _.isEqual(mainQuery, smartList.definition.query) &&
    _.isEqual(selectedFields.value, smartList.definition.fields)
  )
    ? false 
    : true;
}

function onScrollEnd() {
  if (mainQuery.limit < table.pagination.meta.total) {
    mainQuery.limit += PAGE_LIMIT;  
  }
}

function handleRowClick({record}) {
  router.push({name: 'deals.oportunidades.show', params: {id: record.id }});
}

watch(mainQuery, (newTableState) => {
  if (smartList) {
    checkIfTableChange();
  }
  fetchPage(mainQuery);
});

onMounted(async () => {
  page.isLoading = true;
  if (!route.params.id) {
    page.title = trans('deals.menu.oportunidades');
    if (authStore.isDirector()) {
      const directorFields = ['deal', 'branch', 'owner', 'category', 'value'];

      table.columns.forEach(column => {
        column.show = false;
      });

      let selectedColumns = directorFields.map(field => {
        let column = table.columns.find(column => column.key == field);
        column.show = true;
        return column;
      });

      let remainingColumns = table.columns.filter(column => !column.show);      
      
      table.columns = selectedColumns.concat(remainingColumns);
      
      mainQuery.sort = {
        column: 'estimated_size',
        direction: 'desc'
      }
    }
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
