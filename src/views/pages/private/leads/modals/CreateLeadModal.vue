<template>
  <BaseModal :isLoading="isLoading" @close-modal="onCloseModal" @save-modal="onSubmit">
    <template #title>{{ trans('leads.labels.add_lead') }}</template>
    <Alert class="mb-4"/>

    <Form ref="formRef" id="create-lead" @submit.prevent="onSubmit" class="w-[700px] max-w-[100%]">      

      <div class="border-b-2 border-gray-100 pb-4 mt-4">
        <div class="flex gap-2 flex-col lg:flex-row">
          <div class="w-full lg:w-1/2">
            <Dropdown  
              class="mb-4" 
              :required="true"           
              :label="trans('leads.labels.customer')"
              :options="customers" 
              selectLabel="name"
              name="customer" 
              v-model="form.customer_id"              
            />  

            <Dropdown  
              class="mb-4"  
              :required="true"          
              :label="trans('leads.labels.status')"
              :options="leadStatuses" 
              name="status" 
              v-model="form.status"              
            />           
          </div>
          <div class="w-full lg:w-1/2">
            <Dropdown  
              class="mb-4"
              :required="true"
              :label="trans('leads.labels.owner')"
              selectLabel="name"
              name="owner" 
              :options="users" 
              v-model="form.owner_id"              
            />  

            <Dropdown  
              :required="true"
              class="mb-4"
              :label="trans('leads.labels.source')"
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
              :label="trans('leads.labels.requirement_size')"
              :options="leadRequirementSize" 
              name="requirement_size" 
              v-model="form.requirement_size"              
            /> 
            <Dropdown  
              class="mb-4"
              :label="trans('leads.labels.profile')"
              :options="leadProfile" 
              name="profile" 
              v-model="form.profile"              
            /> 

            <TextInput type="textarea" class="mb-4" :required="false" name="quotation_list" v-model="form.quotation_list" :label="trans('leads.labels.quotation_list')"/>

            <TextInput type="text" :required="false" name="showroom" v-model="form.showroom" :label="trans('leads.labels.showroom')"/>


          </div>
          <div class="w-full lg:w-1/2">  
            <Dropdown  
              class="mb-4"
              :required="true"
              :label="trans('leads.labels.category')"
              :options="leadCategories" 
              name="category" 
              v-model="form.category_id"              
            />

            <TextInput class="mb-4" type="textarea" :required="false" name="requirement" v-model="form.requirement" :label="trans('leads.labels.requirement')"/>

            <TextInput type="datetime-local" :required="false" name="appointment_at" v-model="form.appointment_at" :label="trans('leads.labels.appointment_at')"/>


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
import InfiniteDropdown from "@/views/components/input/InfiniteDropdown";
import { leadStatuses, leadProfile, leadRequirementSize } from "@/stub/statuses";
import { leadCategories } from "@/stub/categories";
import CustomerService from "@/services/CustomerService";
import LeadService from "@/services/LeadService";
import SectorService from "@/services/SectorService";
import SourceService from "@/services/SourceService";
import UserService from "@/services/UserService";
import Alert from "@/views/components/Alert";
import {clearObject, reduceProperties} from "@/helpers/data";
import {useAlertStore} from "@/stores";

const emit = defineEmits(["close-modal"]);

const initialState = {
  customer_id: null, 
  requirement: null, 
  requirement_size: null, 
  profile: null, 
  quotation_list: null, 
  showroom: null, 
  source_id: null,
  category_id: null,
  owner_id: null,  
  status: null,
  appointment_at: null,
};

const form = reactive({...initialState});

const leadService = new LeadService();
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

  leadService.handleCreate(
      'create-lead', 
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