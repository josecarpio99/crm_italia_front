<template>
  <BaseModal :isLoading="isLoading" @close-modal="onCloseModal" @save-modal="onSubmit">
    <template #title>{{ trans('deals.phrases.convert_oportunidad') }}</template>
    <Alert class="mb-4"/>

    <Form ref="formRef" id="create-deal" @submit.prevent="onSubmit" class="w-[700px] max-w-[100%]">      

      <div class="flex gap-2 flex-col">
          <div class="w-full">
            <Dropdown  
              class="mb-4" 
              :required="true"           
              :label="trans('deals.labels.main_contact')"
              :options="customers" 
              selectLabel="name"
              name="customer" 
              v-model="form.customer_id"              
            />  

            <TextInput type="text" class="mb-4" :required="false" name="value" v-model="form.value" :label="trans('deals.labels.value')"/>

                   
          </div>

          <div class="w-full">
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

          <div class="w-full">                      
            
            <Dropdown  
              class="mb-4"
              :required="true"
              :label="trans('deals.labels.owner')"
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

          </div>

        </div>

    </Form>

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

const props = defineProps({
  deal: {
    required: true,
    type: Object
  }
});

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
      reduceProperties(form, ['category_id', 'customer_id', 'source_id', 'owner_id', 'estimated_close_date_range'], 'id')
    ).then((res) => {                
    if (res?.status == 200 || res?.status == 201) {        
      router.push({name: 'deals.cotizados.show', params: {id: res.data.data.id}});
    }
  })
  
  return false;
}

function onCloseModal() {
  emit('close-modal');
}

onMounted( async () => {
  form.customer_id = customers.find(option => option.id === props.deal.customer?.id);
  form.source_id = sources.find(option => option.id === props.deal.source?.id);
  form.owner_id = users.find(option => option.id === props.deal.owner?.id);
  form.category_id = dealCategories.find(option => option.id === props.deal.category?.id);
  form.estimated_close_date_range = dealEstimatedCloseDateRange.find(option => option.id === props.deal.estimated_close_date_range);


  form.type = 'cotizado';
  form.win_probability = props.deal.win_probability;
  form.value = props.deal.value;
  form.name = props.deal.name;
  
  isLoading.value = false;
});

</script>