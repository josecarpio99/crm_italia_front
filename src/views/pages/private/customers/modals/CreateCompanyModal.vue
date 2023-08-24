<template>
  <BaseModal :isLoading="isLoading" @close-modal="onCloseModal" @save-modal="onSubmit">
    <template #title>{{ trans('customers.labels.add_company') }}</template>
    <Alert class="mb-4"/>

    <Form ref="formRef" id="create-company" @submit.prevent="onSubmit" class="w-[700px] max-w-[100%]">
      <div class="border-b-2 border-gray-100 pb-4">
        <div class="flex gap-2 flex-col ">
         
          <div class="w-full ">
            <TextInput 
              class="mb-4" 
              type="text" 
              :required="true" 
              name="company_name" 
              v-model="form.company_name" 
              :label="trans('customers.labels.company_name')"
              :errorMessage="v$.company_name.$errors.length ? v$.company_name.$errors[0].$message : ''"
            />

            <TextInput 
              class="mb-4" 
              type="text" 
              :required="true" 
              name="name" 
              v-model="form.name" 
              :label="trans('customers.labels.name')"
              :errorMessage="v$.name.$errors.length ? v$.name.$errors[0].$message : ''"
            />         

          </div>
          
          <div class="w-full ">
            <!-- <div class="flex flex-col sm:flex-row gap-2">
            </div> -->
            <TextInput 
              class="mb-4" 
              type="email" 
              :required="true" 
              name="email" 
              v-model="form.email" 
              :label="trans('users.labels.email')"
              :errorMessage="v$.email.$errors.length ? v$.email.$errors[0].$message : ''"
            />

            <TextInput 
              class="mb-4 w-full " 
              type="text" 
              :required="true" 
              name="mobile" 
              v-model="form.mobile" 
              :label="trans('customers.labels.mobile')"
              :errorMessage="v$.mobile.$errors.length ? v$.mobile.$errors[0].$message : ''"
            />          
            
            <Dropdown  
              class="mb-4 customer_category"
              :required="true"
              :label="trans('customers.labels.category')"
              :options="customerCategories" 
              name="category" 
              v-model="form.category_id"   
              :errorMessage="v$.category_id.$errors.length ? v$.category_id.$errors[0].$message : ''"                         
            /> 

            <Dropdown  
              class="mb-4"
              :required="true"
              :label="trans('global.labels.adviser_in_charge')"
              selectLabel="name"
              name="owner" 
              :options="users" 
              v-model="form.owner_id"              
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
import { customerCategories } from "@/stub/categories";
import CustomerService from "@/services/CustomerService";
import SectorService from "@/services/SectorService";
import CountryService from "@/services/CountryService";
import Alert from "@/views/components/Alert";
import {clearObject, reduceProperties} from "@/helpers/data";
import {useAlertStore} from "@/stores";
import {useUsersStore} from "@/stores/users";
import {useAuthStore} from "@/stores/auth";
import {useCustomersStore} from "@/stores/customers";
import useVuelidate from '@vuelidate/core';
import {
  required,
  maxLength,  
  helpers
} from '@vuelidate/validators';

const emit = defineEmits(["close-modal"]);

const customerService = new CustomerService();
const sectorService = new SectorService();
const countryService = new CountryService();
const alertStore = useAlertStore();
const usersStore = useUsersStore();
const authStore = useAuthStore();
const customersStore = useCustomersStore();

const formRef = ref(null);
const isLoading = ref(true);

const initialState = {
  // is_company: 1,
  company_name: '',           
  name: '',           
  email: '',
  mobile: '',
  category_id: null,
  owner_id: {
    id: authStore.user.id,
    name: authStore.user.name,
  }
};

const form = reactive({...initialState});

const rules = {
  company_name: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  },
  name: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  },
  mobile: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  }, 
  email: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  },
  category_id: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  }, 
  owner_id: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  }
}

const v$ = useVuelidate(rules, form);

let sectors = null;
let users = usersStore.userList;
let companies = null;
let countries = null;

function onSubmit() {  
  alertStore.clear();

  v$.value.$touch();

  if (v$.value.$invalid) {
    return true
  }

  v$.value.$reset();

  customerService.handleCreate(
      'create-company', 
      reduceProperties(form, ['category_id', 'owner_id'], 'id')
    ).then((res) => {                
    if (res?.status == 200 || res?.status == 201) {        
        Object.assign(form, initialState);
        customersStore.customerList.unshift({
          id: res.data.data.id,
          name: res.data.data.name,
        })
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
  countries = await countryService.index().then(res => res.data);
  companies = await customerService.list({company: 1}).then(res => res.data);
  isLoading.value = false;

});

</script>