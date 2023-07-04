<template>
  <BaseModal :isLoading="isLoading" :show-delete="props.showDelete" @close-modal="onCloseModal" @save-modal="onSubmit" @delete="$emit('delete')">
    <template #title>{{ trans('deals.labels.edit_oportunidad') }}</template>
    <Alert class="mb-4"/>

    <Form ref="formRef" id="update-deal" @submit.prevent="onSubmit" class="w-[700px] max-w-[100%]">
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
           
            <TextInput class="mb-4" type="text" :required="true" name="estimated_size" v-model="form.estimated_size" :label="trans('deals.labels.estimated_size')"/>

            <Dropdown  
              class="mb-4"
              :required="false"
              :label="trans('deals.labels.pm_in_charge')"
              name="pm" 
              :options="pmChargeStatuses" 
              v-model="form.has_project_manager"              
            /> 

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
              :required="false"
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
import { dealCustomerResponsiveness, dealStages, pmChargeStatuses } from "@/stub/statuses";
import { dealCategories } from "@/stub/categories";
import DealService from "@/services/DealService";
import Alert from "@/views/components/Alert";
import {clearObject, fillObject, reduceProperties, removeEmpty} from "@/helpers/data";
import {useAlertStore} from "@/stores";
import {useUsersStore} from "@/stores/users";
import {useCustomersStore} from "@/stores/customers";
import {useSourcesStore} from "@/stores/sources";

const props = defineProps({  
  deal: {
    type: Object,
    required: true
  }, 
  showDelete: {
    type: Boolean,
    dafault: false
  }
});

const emit = defineEmits(['close-modal', 'updated', 'delete']);

const form = reactive({});

const dealService = new DealService();
const alertStore = useAlertStore();
const usersStore = useUsersStore();
const customersStore = useCustomersStore();
const sourcesStore = useSourcesStore();
const formRef = ref(null);
const isLoading = ref(true);

let users = usersStore.userList;
let customers = customersStore.customerList;
let sources = sourcesStore.sourceList;

function onSubmit() {  
  alertStore.clear();
  let data = reduceProperties(form, ['deal_pipeline_stage_id', 'category_id', 'customer_id', 'source_id', 'owner_id', 'customer_responsiveness', 'has_project_manager'], 'id');
  dealService.handleUpdate(
      'update-deal', 
      form.id,
      removeEmpty(data)
    ).then((res) => {                
    if (res?.status == 200 || res?.status == 201) {
        emit('updated');
    }
  })
  
  return false;
}

function onCloseModal() {
  emit('close-modal');
}

onMounted( async () => {
  Object.assign(form, props.deal);
  
  form.customer_id = customers.find(option => option.id === form.customer?.id);
  form.has_project_manager = pmChargeStatuses.find(option => option.id == form.has_project_manager);
  form.source_id = sources.find(option => option.id === form.source?.id);
  form.owner_id = users.find(option => option.id === form.owner?.id);
  form.category_id = dealCategories.find(option => option.id === form.category?.id);
  form.deal_pipeline_stage_id = dealStages.find(option => option.id == form.stage?.id);
  form.customer_responsiveness = dealCustomerResponsiveness.find(option => option.id === form.customer_responsiveness);
  
  isLoading.value = false;
});

</script>