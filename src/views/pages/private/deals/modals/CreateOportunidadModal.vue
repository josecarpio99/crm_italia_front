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
           
            <TextInput class="mb-4" type="text" :required="false" name="estimated_size" v-model="form.estimated_size" :label="trans('deals.labels.estimated_size')"/>

          </div>
          <div class="w-full lg:w-1/2"> 
          
            <TextInput class="mb-4" type="text" :required="false" name="win_probability" v-model="form.win_probability" :label="trans('deals.labels.win_probability')"/>            


            <TextInput class="mb-4" type="datetime-local" :required="false" name="estimated_close_date" v-model="form.estimated_close_date" :label="trans('deals.labels.estimated_close_date')"/>

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
              :required="true"
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
import { dealCustomerResponsiveness, dealStages } from "@/stub/statuses";
import CustomerService from "@/services/CustomerService";
import DealService from "@/services/DealService";
import SectorService from "@/services/SectorService";
import SourceService from "@/services/SourceService";
import UserService from "@/services/UserService";
import Alert from "@/views/components/Alert";
import {clearObject, reduceProperties} from "@/helpers/data";
import {useAlertStore} from "@/stores";

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
  estimated_size: null,
  customer_responsiveness: null,
  value: null,
  name: null
};

const form = reactive({...initialState});

const dealService = new DealService();
const sourceService = new SourceService();
const customerService = new CustomerService();
const userService = new UserService();
const alertStore = useAlertStore();
const formRef = ref(null);
const isLoading = ref(true);

let users = null;
let customers = null;
let sources = null;

function onSubmit() {  
  alertStore.clear();
  console.log(form);

  dealService.handleCreate(
      'create-deal', 
      reduceProperties(form, ['status', 'profile', 'category_id', 'customer_id', 'source_id', 'owner_id'], 'id')
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
  users = await userService.list().then(res => res.data);
  customers = await customerService.list().then(res => res.data);
  sources = await sourceService.index().then(res => res.data);

  isLoading.value = false;
});

</script>