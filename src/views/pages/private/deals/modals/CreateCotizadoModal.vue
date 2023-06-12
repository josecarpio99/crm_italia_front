<template>
  <BaseModal :isLoading="isLoading" @close-modal="onCloseModal" @save-modal="onSubmit">
    <template #title>{{ trans('customers.labels.add_cotizado') }}</template>
    <Alert class="mb-4"/>

    <Form ref="formRef" id="create-cotizado" @submit.prevent="onSubmit" class="w-[700px] max-w-[100%]">      

      <div class="border-b-2 border-gray-100 pb-4 mt-4">
        <div class="flex gap-2 flex-col lg:flex-row">
          <div class="w-full lg:w-1/2">
            <Dropdown  
              class="mb-4"            
              :label="trans('customers.labels.customer_status')"
              :options="leadStatuses" 
              name="customer_status" 
              v-model="form.status"              
            />           
          </div>
          <div class="w-full lg:w-1/2">
            <Dropdown  
              class="mb-4"
              :label="trans('customers.labels.owner')"
              selectLabel="name"
              name="owner" 
              :options="users" 
              v-model="form.owner_id"              
            />
            <TextInput class="mb-4" type="text" name="website" v-model="form.website" :label="trans('customers.labels.website')"/>             
          </div>
        </div>
      </div>

      <div class="border-b-2 border-gray-100 mt-4">
        <div class="flex gap-2 flex-col lg:flex-row">
          <div class="w-full lg:w-1/2">
            <Dropdown  
              :label="trans('customers.labels.category')"
              :options="leadCategories" 
              name="category" 
              v-model="form.category_id"              
            /> 
          </div>
          <div class="w-full lg:w-1/2">     
            <TextInput class="mb-4" type="text" :required="true" name="origen" v-model="form.origin" :label="trans('customers.labels.origin')"/>
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
import { leadStatuses } from "@/stub/statuses";
import { leadCategories } from "@/stub/categories";
import CustomerService from "@/services/CustomerService";
import SectorService from "@/services/SectorService";
import SourceService from "@/services/SourceService";
import UserService from "@/services/UserService";
import Alert from "@/views/components/Alert";
import {clearObject, reduceProperties} from "@/helpers/data";
import {useAlertStore} from "@/stores";

const emit = defineEmits(["close-modal"]);

const initialState = {
  type: 'cotizado',
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
  customerService.handleCreate(
      'create-cotizado', 
      reduceProperties(form, ['status', 'category_id', 'source_id', 'owner_id'], 'id')
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