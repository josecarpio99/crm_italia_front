<template>
  <BaseModal :isLoading="isLoading" @close-modal="onCloseModal" @save-modal="onSubmit">
    <template #title>{{ trans('deals.labels.add_oportunidad') }}</template>
    <Alert class="mb-4"/>

    <Form ref="formRef" id="create-deal" @submit.prevent="onSubmit" class="w-[700px] max-w-[100%]">      

      <p class="text-gray-500 text-xs"><span class="font-bold">Nota:</span> Recuerda que una oportunidad es un proyecto que <span class="font-bold uppercase">aún no esta cotizado</span>,
      pero es una posibilidad de venta.</p>

      <div class="border-b-2 border-gray-100 pb-4 mt-4">
        
        <div class="flex gap-2 flex-col">
          <div class="w-full">
            <Dropdown  
              class="" 
              :required="false"           
              :label="trans('deals.labels.main_contact')"
              :options="customers" 
              selectLabel="name"
              name="customer" 
              v-model="form.customer_id"              
            />  

            <span class="text-blue-300 text-xs mt-[1px] mb-4 block">Agregar <button class="uppercase text-blue-500 font-semibold hover:text-blue-700" @click.prevent="toggleModal('CreatePersonModal')">Persona</button> o <button class="uppercase text-blue-500 font-semibold hover:text-blue-700" @click.prevent="toggleModal('CreateCompanyModal')">Empresa</button></span>

            <TextInput type="text" class="mb-4" :required="false" name="value" v-model="form.value" :label="trans('deals.labels.oportunidad_estimated_value')"/>

                   
          </div>

          <div class="w-full">
            <TextInput type="text" class="mb-4" :required="false" name="name" v-model="form.name" :label="trans('deals.labels.company_name')"/>

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
          
            <TextInput class="mb-4" type="text" :required="false" name="win_probability" v-model="form.win_probability" :label="trans('deals.labels.win_probability')"/>

            <Dropdown  
              class="mb-4"
              :required="false"
              :label="trans('deals.labels.estimated_close_date')"
              :options="dealEstimatedCloseDateRange" 
              name="estimated_close_date_range" 
              v-model="form.estimated_close_date_range"              
            />

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
import Dropdown from "@/views/components/input/Dropdown";
import { dealCategories } from "@/stub/categories";
import { dealEstimatedCloseDateRange } from "@/stub/statuses";
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

const initialState = {
  type: 'oportunidad',    
  customer_id: null,    
  source_id: null,
  category_id: null,
  owner_id: null,
  win_probability: null,
  estimated_close_date_range: null,
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
const showCreatePersonModal = ref(false);
const showCreateCompanyModal = ref(false);
const customersStore = useCustomersStore();
const sourcesStore = useSourcesStore();

let users = usersStore.userList;
let customers = customersStore.customerList;
let sources = sourcesStore.sourceList;

function onSubmit() {  
  alertStore.clear();

  dealService.handleCreate(
      'create-deal', 
      reduceProperties(form, ['category_id', 'customer_id', 'source_id', 'owner_id', 'estimated_close_date_range'], 'id')
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
  form.owner_id = {
    id: authStore.user.id,
    name: authStore.user.name,
  }
  isLoading.value = false;
});

</script>