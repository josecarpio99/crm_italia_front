<template>
  <BaseModal :isLoading="isLoading" @close-modal="onCloseModal" @save-modal="onSubmit">
    <template #title>{{ trans('customers.labels.add_contact') }}</template>
    <Alert class="mb-4"/>

    <Form ref="formRef" id="create-company" @submit.prevent="onSubmit" class="w-[700px] max-w-[100%]">
      <div class="border-b-2 border-gray-100 pb-4">
        <div class="flex gap-2 flex-col ">
         
          <div class="w-full ">
            <StarToggle 
              class="mb-4"
              v-model="form.star" 
              iconClass="h-6 w-6"  
              :label="trans('customers.labels.key_contact')"
              :showLabel="true"
            />

            <TextInput 
              class="mb-4" 
              type="text" 
              :required="true" 
              name="company_name" 
              v-model="form.company_name" 
              :label="trans('customers.labels.company_name')"
              :errorMessage="vv$.company_name.$errors.length ? vv$.company_name.$errors[0].$message : ''"
            />

            <TextInput 
              class="mb-4" 
              type="text" 
              :required="true" 
              name="name" 
              v-model="form.name" 
              :label="trans('customers.labels.name')"
              :errorMessage="vv$.name.$errors.length ? vv$.name.$errors[0].$message : ''"
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
              :errorMessage="vv$.email.$errors.length ? vv$.email.$errors[0].$message : ''"
            />

            <TextInput 
              class="mb-4 w-full " 
              type="text" 
              :required="true" 
              name="mobile" 
              v-model="form.mobile" 
              :label="trans('customers.labels.mobile')"
              :errorMessage="vv$.mobile.$errors.length ? vv$.mobile.$errors[0].$message : ''"
            />          
            
            <Dropdown  
              class="mb-4 customer_category"
              :required="true"
              :label="trans('customers.labels.category')"
              :options="customerCategories" 
              name="category" 
              v-model="form.category_id"   
              :errorMessage="vv$.category_id.$errors.length ? vv$.category_id.$errors[0].$message : ''"                         
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

          <Dropdown  
            :required="false"
            class="mb-4 deal_source"
            :label="trans('customers.labels.customer_source')"
            selectLabel="name"
            name="source" 
            :options="sourcesStore.sourceList" 
            v-model="form.source_id"      
            :errorMessage="vv$.source_id.$errors.length ? vv$.source_id.$errors[0].$message : ''"
          />

          <TextInput 
            class="mb-4" 
            type="text" 
            :required="false" 
            name="city" 
            v-model="form.city" 
            :label="trans('customers.labels.city')"
          />   
          
          <div class="flex items-center justify-end gap-2 pl-2 pt-4">
            <input 
              type="checkbox"
              ref="saveAndCreateOportunidad"
              name="saveAndCreateOportunidad"
              id="saveAndCreateOportunidad"
            >
            <label for="saveAndCreateOportunidad">Guardar y crear oportunidad</label>
          </div>

        </div>
      </div>

    </Form>

    <template>
      <CreateOportunidadModal v-if="customerId" :customer_id="customerId" :modalActive="showCreateOportunidadModal" @close-modal="handleCloseOportunidad"/>
    </template>
  </BaseModal>


</template>

<script setup>
import {reactive, ref, onMounted} from "vue";
import router from "@/router";
import {trans} from "@/helpers/i18n";
import BaseModal from '@/views/components/BaseModal';
import Form from "@/views/components/Form";
import TextInput from "@/views/components/input/TextInput";
import Dropdown from "@/views/components/input/Dropdown";
import StarToggle from "@/views/components/input/StarToggle";
import { customerCategories } from "@/stub/categories";
import CustomerService from "@/services/CustomerService";
import Alert from "@/views/components/Alert";
import {clearObject, reduceProperties} from "@/helpers/data";
import {useAlertStore} from "@/stores";
import {useUsersStore} from "@/stores/users";
import {useAuthStore} from "@/stores/auth";
import {useSourcesStore} from "@/stores/sources";
import {useCustomersStore} from "@/stores/customers";
import CreateOportunidadModal from "@/views/pages/private/deals/modals/CreateOportunidadModal.vue";
import useVuelidate from '@vuelidate/core';
import {
  required,
  maxLength,  
  helpers
} from '@vuelidate/validators';

const emit = defineEmits(["close-modal"]);

const customerService = new CustomerService();
const alertStore = useAlertStore();
const usersStore = useUsersStore();
const authStore = useAuthStore();
const customersStore = useCustomersStore();
const sourcesStore = useSourcesStore();
const customerId = ref(null);

const formRef = ref(null);
const isLoading = ref(true);
const saveAndCreateOportunidad = ref(null);
const showCreateOportunidadModal = ref(false);

const initialState = {
  // is_company: 1,
  star: false,           
  company_name: null,      
  city: null,           
  name: null,           
  email: null,
  mobile: null,
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
  source_id: {
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

const vv$ = useVuelidate(rules, form);

let users = usersStore.userList;

function onSubmit() { 
  let createOportunidad = saveAndCreateOportunidad.value.checked;
  // return;
  alertStore.clear();

  vv$.value.$touch();

  if (vv$.value.$invalid) {
    console.log(vv$);
    return true;
  }

  vv$.value.$reset();

  customerService.handleCreate(
      'create-company', 
      reduceProperties(form, ['category_id', 'owner_id', 'source_id'], 'id')
    ).then((res) => {                
    if (res?.status == 200 || res?.status == 201) {        
        Object.assign(form, initialState);
        customersStore.customerList.unshift({
          id: res.data.data.id,
          name: res.data.data.name,
        });

        customersStore.getCustomerList();
        
        if (createOportunidad) {
          customerId.value = res.data.data.id;
          showCreateOportunidadModal.value = true;
        } else {
          emit('close-modal');
          router.push({name: 'customers.show', params: {id: res.data.data.id}});
        }
        // emit('close-modal');

    }
  })
  
  return false;
}

function onCloseModal() {
  Object.assign(form, initialState);
  emit('close-modal');
}

function handleCloseOportunidad() {
  showCreateOportunidadModal.value = false;
  emit('close-modal');
}

onMounted( async () => {
  isLoading.value = false;

});

</script>