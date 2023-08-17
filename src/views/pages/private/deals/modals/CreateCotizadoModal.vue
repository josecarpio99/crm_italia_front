<template>
  <BaseModal :isLoading="isLoading" @close-modal="onCloseModal" @save-modal="onSubmit">
    <template #title>{{ trans('deals.labels.add_cotizado') }}</template>
    <Alert class="mb-4"/>

    <Form ref="formRef" id="create-cotizado" @submit.prevent="onSubmit" class="w-[700px] max-w-[100%]">      

      <p class="text-gray-500 text-xs mb-2"><span class="font-bold">Nota:</span> Es cuando ya tienes una cotización en firme con tu cliente.  El proyecto debe de estar vivo para que siga contanto como una cotización.</p>

      <TextInput type="text" class="mb-4" :required="false" name="name" v-model="form.name" :label="trans('deals.labels.company_name')"/> 

      <div class="flex gap-4 flex-col md:flex-row md:justify-between mb-8">
        <MoneyInput class="md:mb-0 md:w-1/2" name="value" v-model="form.value" :label="trans('deals.labels.cotizado_estimated_value')" />

        <Dropdown  
          class="md:mb-0 md:w-1/2 estimated_close_date_range"
          :required="false"
          :label="trans('deals.labels.estimated_close_date')"
          :options="dealEstimatedCloseDateRange" 
          name="estimated_close_date_range" 
          v-model="form.estimated_close_date_range"              
        />
      </div>

      <Toggle v-model="showCustomerSection" class="mb-2 text-right" label="Agregar nuevo contacto" />

      <div v-if="showCustomerSection" class="rounded-sm border-2 px-2 pt-4 mb-6 bg-gray-50">

        <p class="text-gray-500 font-semibold">{{ trans('deals.phrases.main_contact') }}</p>

        <TextInput class="mb-4 w-full" type="text" :required="true" name="name" v-model="form.customer.name" :label="trans('global.labels.name')"/>

        <TextInput class="mb-4 w-full" type="email" :required="false" name="email" v-model="form.customer.email" :label="trans('users.labels.email')"/>

        <TextInput class="mb-4 w-full " type="text" :required="false" name="mobile" v-model="form.customer.mobile" :label="trans('customers.labels.mobile')"/>
      </div>

      <Dropdown  
        v-else
        class="mb-4" 
        :required="false"           
        :label="trans('deals.labels.main_contact')"
        :options="customers" 
        selectLabel="name"
        name="customer" 
        v-model="form.customer_id"              
      /> 
        
        <div class="flex gap-2 flex-col">
          <div class="w-full">                      

            <!-- <span class="text-blue-300 text-xs mt-[1px] mb-4 block">Agregar <button class="uppercase text-blue-500 font-semibold hover:text-blue-700" @click.prevent="toggleModal('CreatePersonModal')">Persona</button> o <button class="uppercase text-blue-500 font-semibold hover:text-blue-700" @click.prevent="toggleModal('CreateCompanyModal')">Empresa</button></span> -->

            <!-- <TextInput type="text" class="mb-4" :required="false" name="value" v-model="form.value" :label="trans('deals.labels.oportunidad_estimated_value')"/> -->
                   
          </div>

          <div class="w-full">            

            <Dropdown  
              :required="false"
              class="mb-4"
              :label="trans('deals.labels.oportunidad_source')"
              selectLabel="name"
              name="source" 
              :options="sources" 
              v-model="form.source_id"              
            />
                                 
          </div>

          <div class="w-full">                      
            
            <Dropdown  
              class="mb-4"
              :required="false"
              :label="trans('global.labels.adviser_in_charge')"
              selectLabel="name"
              name="owner" 
              :options="users" 
              v-model="form.owner_id"              
            />                     

          </div>

          <div class="w-full">            

            <Dropdown  
              class="mb-4"
              :required="false"
              :label="trans('deals.labels.category')"
              :options="dealCategories" 
              name="category" 
              v-model="form.category_id"              
            />     

          </div>

        </div>  

    </Form>

    <template>
      <CreatePersonModal :modalActive="showCreatePersonModal" @close-modal="toggleModal('CreatePersonModal')"/>
      <CreateCompanyModal :modalActive="showCreateCompanyModal" @close-modal="toggleModal('CreateCompanyModal')"/>
    </template>

  </BaseModal>
</template>

<script setup>
import {reactive, ref, onMounted} from "vue";
import {trans} from "@/helpers/i18n";
import BaseModal from '@/views/components/BaseModal';
import Form from "@/views/components/Form";
import TextInput from "@/views/components/input/TextInput";
import MoneyInput from "@/views/components/input/MoneyInput";
import Toggle from "@/views/components/input/Toggle";
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
import CreatePersonModal from "@/views/pages/private/customers/modals/CreatePersonModal.vue";
import CreateCompanyModal from "@/views/pages/private/customers/modals/CreateCompanyModal.vue";
const emit = defineEmits(["close-modal"]);

const dealService = new DealService();
const alertStore = useAlertStore();
const usersStore = useUsersStore();
const authStore = useAuthStore();

const formRef = ref(null);
const showCustomerSection = ref(true);
const isLoading = ref(true);
const showCreatePersonModal = ref(false);
const showCreateCompanyModal = ref(false);
const customersStore = useCustomersStore();
const sourcesStore = useSourcesStore();


const initialState = {
  type: 'cotizado',    
  customer_id: null,    
  source_id: null,
  category_id: null,
  owner_id: {
    id: authStore.user.id,
    name: authStore.user.name,
  },
  estimated_close_date_range: null,
  value: 0,
  name: null,
  customer: {
    name: null,
    email: null,
    mobile: null,
  }
};

const form = reactive(structuredClone(initialState));

let users = usersStore.userList;
let customers = customersStore.customerList;
let sources = sourcesStore.sourceList;

function onSubmit() {  
  alertStore.clear();

  form.value = typeof form.value == 'string' ? form.value.replace(/\D/g, '') : form.value;

  if (!showCustomerSection.value) {
    delete form['customer'];
  }

  dealService.handleCreate(
      'create-cotizado', 
      reduceProperties(form, ['category_id', 'customer_id', 'source_id', 'owner_id','estimated_close_date_range'], 'id')
    ).then((res) => {                
    if (res?.status == 200 || res?.status == 201) {        
        Object.assign(form, structuredClone(initialState));

    }
  })
  
  return false;
}

function onCloseModal() {
  Object.assign(form, structuredClone(initialState));
  emit('close-modal');
}

function toggleModal(key) {
  alertStore.clear();
  if (key === 'CreatePersonModal') {
    showCreatePersonModal.value = !showCreatePersonModal.value;            
  }
  if (key === 'CreateCompanyModal') {
    showCreateCompanyModal.value = !showCreateCompanyModal.value;
  }  

  if (
      showCreateCompanyModal.value == true ||
      showCreatePersonModal.value == true
  ) {
      alertStore.showOnPage = false;
  } else {
      alertStore.showOnPage = true;
  }
}

onMounted( async () => {
  isLoading.value = false;
});

</script>