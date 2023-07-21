<template>
  <BaseModal :isLoading="isLoading" @close-modal="onCloseModal" @save-modal="onSubmit">
    <template #title>{{ trans('customers.labels.add_person') }}</template>
    <Alert class="mb-4"/>

    <Form ref="formRef" id="create-person" @submit.prevent="onSubmit" class="w-[700px] max-w-[100%]">
      <div class="border-b-2 border-gray-100 pb-4">
        <div class="flex gap-2 flex-col lg:flex-row">
         
          <div class="w-full lg:w-1/2">
            <TextInput class="mb-4" type="text" :required="true" name="name" v-model="form.name" :label="trans('global.labels.name')"/>
            
            <Dropdown  
              class="mb-4"            
              :label="trans('customers.labels.company_name')"
              selectLabel="name"
              :options="companies" 
              name="company" 
              v-model="form.parent_id"              
            /> 

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

            <div class="flex flex-col sm:flex-row gap-2">
              <TextInput class="mb-4 w-full lg:w-1/2" type="text" :required="false" name="state" v-model="form.state" :label="trans('customers.labels.state')"/>

              <Dropdown  
                class="mb-4 w-full lg:w-1/2"            
                :label="trans('customers.labels.country')"
                selectLabel="name"
                :options="countries" 
                name="country" 
                v-model="form.country_id"              
              /> 
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
import { customerStatuses, potentialCustomerStatuses } from "@/stub/statuses";
import { customerCategories } from "@/stub/categories";
import CustomerService from "@/services/CustomerService";
import SectorService from "@/services/SectorService";
import CountryService from "@/services/CountryService";
import Alert from "@/views/components/Alert";
import {clearObject, reduceProperties} from "@/helpers/data";
import {useAlertStore} from "@/stores";
import {useUsersStore} from "@/stores/users";
import {useAuthStore} from "@/stores/auth";

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
  parent_id: null,
  position: '',
  city: '',
  postcode: '',
  state: '',
  country_id: null,
  customer_status: '',
  potential_customer_status: '',
};

const form = reactive({...initialState});

const customerService = new CustomerService();
const sectorService = new SectorService();
const countryService = new CountryService();
const alertStore = useAlertStore();
const usersStore = useUsersStore();
const authStore = useAuthStore();

const formRef = ref(null);
const isLoading = ref(true);
let sectors = null;
let users = usersStore.userList;
let companies = null;
let countries = null;

function onSubmit() {  
  alertStore.clear();
  customerService.handleCreate(
      'create-person', 
      reduceProperties(form, ['customer_status', 'potential_customer_status', 'category_id', 'sector_id', 'country_id', 'parent_id', 'owner_id'], 'id')
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
  countries = await countryService.index().then(res => res.data);
  companies = await customerService.list({company: 1}).then(res => res.data);
  form.owner_id = {
    id: authStore.user.id,
    name: authStore.user.name,
  }
  isLoading.value = false;
});

</script>