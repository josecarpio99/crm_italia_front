<template>
  <BaseModal :isLoading="isLoading" @close-modal="onCloseModal" @save-modal="onSubmit">
    <template #title>{{ trans('customers.labels.add_person') }}</template>
    <Alert class="mb-4"/>

    <Form ref="formRef" id="create-user" @submit.prevent="onSubmit" class="w-[700px] max-w-[100%]">
      <div class="border-b-2 border-gray-100 pb-4">
        <div class="flex gap-2 flex-col lg:flex-row">
         
          <div class="w-full lg:w-1/2">
            <TextInput class="mb-4" type="text" :required="true" name="name" v-model="form.name" :label="trans('global.labels.name')"/>
            
            <TextInput class="mb-4" type="text" name="company" :label="trans('Por definir')"/>

            <TextInput class="mb-4" type="text" :required="false" name="position" v-model="form.position" :label="trans('customers.labels.position')"/>

          </div>
          
          <div class="w-full lg:w-1/2">
            <div class="flex flex-col sm:flex-row gap-2">
              <TextInput class="mb-4 w-full lg:w-1/2" type="text" :required="true" name="mobile" v-model="form.mobile" :label="trans('customers.labels.mobile')"/>
              <TextInput class="mb-4 w-full lg:w-1/2" type="text" :required="false" name="phone" v-model="form.phone" :label="trans('customers.labels.phone')"/>
            </div>
            <TextInput class="mb-4" type="email" :required="true" name="email" v-model="form.email" :label="trans('users.labels.email')"/>

            <Dropdown  
              class="mb-4"            
              :label="trans('customers.labels.sector')"
              selectLabel="name"
              :options="sectors" 
              name="sector" 
              v-model="form.sector_id"              
            /> 

            <div class="flex flex-col sm:flex-row gap-2">
              <TextInput class="mb-4 w-full lg:w-1/2" type="text" :required="true" name="city" v-model="form.city" :label="trans('customers.labels.city')"/>
              <TextInput class="mb-4 w-full lg:w-1/2" type="text" :required="false" name="postcode" v-model="form.postcode" :label="trans('customers.labels.postcode')"/>
            </div>

          </div>

        </div>
      </div>

      <div class="border-b-2 border-gray-100 pb-4 mt-4">
        <div class="flex gap-2 flex-col lg:flex-row">
          <div class="w-full lg:w-1/2">
            <Dropdown  
              class="mb-4"            
              :label="trans('customers.labels.customer_status')"
              :options="customerStatuses" 
              name="customer_status" 
              v-model="form.customer_status"              
            /> 
            <Dropdown  
              class="mb-4"
              :label="trans('customers.labels.potential_customer_status')"
              :options="potentialCustomerStatuses" 
              name="potential_customer_status" 
              v-model="form.potential_customer_status"              
            />
          </div>
          <div class="w-full lg:w-1/2">
            <InfiniteDropdown  
              class="mb-4"
              :label="trans('customers.labels.owner')"
              name="owner" 
              v-model="form.owner_id"              
            />
            <!-- <TextInput class="mb-4" type="text" name="owner" :label="trans('Por definir')"/> -->
            <TextInput class="mb-4" type="text" name="website" v-model="form.website" :label="trans('customers.labels.website')"/>             
          </div>
        </div>
      </div>

      <div class="border-b-2 border-gray-100 mt-4">
        <div class="flex gap-2 flex-col lg:flex-row">
          <div class="w-full lg:w-1/2">
            <Dropdown  
              :label="trans('customers.labels.category')"
              :options="customerCategories" 
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
import { customerStatuses, potentialCustomerStatuses } from "@/stub/statuses";
import { customerCategories } from "@/stub/categories";
import CustomerService from "@/services/CustomerService";
import SectorService from "@/services/SectorService";
import Alert from "@/views/components/Alert";
import {clearObject, reduceProperties} from "@/helpers/data";
import {useAlertStore} from "@/stores";

const emit = defineEmits(["close-modal"]);

const initialState = {
  is_company: 0,
  name: '',           
  email: '',
  phone: '',
  mobile: '',
  website: '',
  origin: '',
  sector_id: null,
  category_id: null,
  owner_id: null,
  position: '',
  city: '',
  postcode: '',
  customer_status: '',
  potential_customer_status: '',
};

const form = reactive({...initialState});

const customerService = new CustomerService();
const sectorService = new SectorService();
const alertStore = useAlertStore();
const formRef = ref(null);
let isLoading = true;
let sectors = null;

function onSubmit() {
  console.log(reduceProperties(form, ['customer_status', 'potential_customer_status', 'category_id', 'sector_id'], 'id'));
  
  alertStore.clear();
  customerService.handleCreate(
      'create-user', 
      reduceProperties(form, ['customer_status', 'potential_customer_status', 'category_id', 'sector_id'], 'id')
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
  sectors = await sectorService.index().then(res => res.data);
  isLoading = false;
});

</script>