<template>
  <BaseModal :isLoading="isLoading" @close-modal="onCloseModal" @save-modal="onSubmit">
    <template #title>{{ trans('deals.labels.add_oportunidad') }}</template>
    <Alert class="mb-4"/>

    <Form ref="formRef" id="create-deal" @submit.prevent="onSubmit" class="w-[700px] max-w-[100%]">      

      <div class="border-b-2 border-gray-100 pb-4 mt-4">
        <div class="flex gap-2 flex-col lg:flex-row">
          <div class="w-full lg:w-1/2">
            <Dropdown  
              class="mb-4" 
              :required="true"           
              :label="trans('deals.labels.customer')"
              :options="customers" 
              selectLabel="name"
              name="customer" 
              v-model="form.customer_id"              
            />  

            <TextInput type="text" class="mb-4" :required="false" name="value" v-model="form.value" :label="trans('deals.labels.value')"/>

                   
          </div>
          <div class="w-full lg:w-1/2">
            <TextInput type="text" class="mb-4" :required="true" name="name" v-model="form.name" :label="trans('deals.labels.name')"/>

            <Dropdown  
              :required="true"
              class="mb-4"
              :label="trans('deals.labels.source')"
              selectLabel="name"
              name="source" 
              :options="sources" 
              v-model="form.source_id"              
            />
                                 
          </div>
        </div>
      </div>

      <div class="border-b-2 border-gray-100 mt-4">
        <div class="flex gap-2 flex-col lg:flex-row">
          <div class="w-full lg:w-1/2">      
            
            <Dropdown  
              class="mb-4"
              :required="true"
              :label="trans('deals.labels.stage')"
              :options="dealStages" 
              name="deal_pipeline_stage_id" 
              v-model="form.deal_pipeline_stage_id"              
            />          
            
            <Dropdown  
              class="mb-4"
              :required="true"
              :label="trans('deals.labels.owner')"
              selectLabel="name"
              name="owner" 
              :options="users" 
              v-model="form.owner_id"              
            /> 
           
            <TextInput class="mb-4" type="text" :required="true" name="estimated_size" v-model="form.estimated_size" :label="trans('deals.labels.estimated_size')"/>

            <Dropdown  
              class="mb-4"
              :required="false"
              :label="trans('deals.labels.pm_in_charge')"
              name="pm" 
              :options="pmChargeStatuses" 
              v-model="form.has_project_manager"              
            /> 

          </div>
          <div class="w-full lg:w-1/2"> 
          
            <TextInput class="mb-4" type="text" :required="false" name="win_probability" v-model="form.win_probability" :label="trans('deals.labels.win_probability')"/>

            <Dropdown  
              class="mb-4"
              :required="true"
              :label="trans('deals.labels.estimated_close_date')"
              :options="dealEstimatedCloseDateRange" 
              name="estimated_close_date_range" 
              v-model="form.estimated_close_date_range"              
            />

            <Dropdown  
              class="mb-4"
              :required="true"
              :label="trans('deals.labels.category')"
              :options="dealCategories" 
              name="category" 
              v-model="form.category_id"              
            />

            <Dropdown  
              class="mb-4"
              :required="false"
              :label="trans('deals.labels.customer_responsiveness')"
              :options="dealCustomerResponsiveness" 
              name="category" 
              v-model="form.customer_responsiveness"              
            />

          </div>
        </div>
      </div>

    </Form>

  </BaseModal>
</template>

<script setup>
import {reactive, ref, onMounted} from "vue";
import {trans} from "@/helpers/i18n";
import BaseModal from '@/views/components/BaseModal';
import Form from "@/views/components/Form";
import TextInput from "@/views/components/input/TextInput";
import Dropdown from "@/views/components/input/Dropdown";
import { dealCategories } from "@/stub/categories";
import { dealCustomerResponsiveness, dealStages, pmChargeStatuses, dealEstimatedCloseDateRange } from "@/stub/statuses";
import DealService from "@/services/DealService";
import SectorService from "@/services/SectorService";
import Alert from "@/views/components/Alert";
import {clearObject, reduceProperties} from "@/helpers/data";
import {useAlertStore} from "@/stores";
import {useUsersStore} from "@/stores/users";
import {useCustomersStore} from "@/stores/customers";
import {useSourcesStore} from "@/stores/sources";
import {useAuthStore} from "@/stores/auth";

const emit = defineEmits(["close-modal"]);

const initialState = {
  type: 'oportunidad',    
  customer_id: null,    
  source_id: null,
  category_id: null,
  owner_id: null,
  win_probability: null,
  deal_pipeline_id: 1,
  deal_pipeline_stage_id: null,
  estimated_close_date: null,
  estimated_close_date_range: null,
  estimated_size: null,
  customer_responsiveness: null,
  has_project_manager: null,
  value: null,
  name: null
};

const form = reactive({...initialState});

const dealService = new DealService();
const alertStore = useAlertStore();
const usersStore = useUsersStore();
const authStore = useAuthStore();

const formRef = ref(null);
const isLoading = ref(true);
const customersStore = useCustomersStore();
const sourcesStore = useSourcesStore();

let users = usersStore.userList;
let customers = customersStore.customerList;
let sources = sourcesStore.sourceList;

function onSubmit() {  
  alertStore.clear();

  dealService.handleCreate(
      'create-deal', 
      reduceProperties(form, ['deal_pipeline_stage_id', 'category_id', 'customer_id', 'source_id', 'owner_id', 'customer_responsiveness', 'has_project_manager', 'estimated_close_date_range'], 'id')
    ).then((res) => {                
    if (res?.status == 200 || res?.status == 201) {        
        Object.assign(form, initialState);

    }
  })
  
  return false;
}

function onCloseModal() {
  Object.assign(form, initialState);
  emit('close-modal');
}

onMounted( async () => {
  form.owner_id = {
    id: authStore.user.id,
    name: authStore.user.name,
  }
  isLoading.value = false;
});

</script>