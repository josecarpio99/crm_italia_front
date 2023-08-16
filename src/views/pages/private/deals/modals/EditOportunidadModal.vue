<template>
  <BaseModal :isLoading="isLoading" :show-delete="props.showDelete" @close-modal="onCloseModal" @save-modal="onSubmit" @delete="$emit('delete')">
    <template #title>{{ trans('deals.labels.edit_oportunidad') }}</template>
    <Alert class="mb-4"/>

    <Form ref="formRef" id="update-deal" @submit.prevent="onSubmit" class="w-[700px] max-w-[100%]">
      <div class="border-b-2 border-gray-100 pb-4 mt-4">
        
        <div class="flex gap-2 flex-col">
          <div class="w-full">
            <TextInput type="text" class="mb-4" :required="false" name="name" v-model="form.name" :label="trans('deals.labels.company_name')"/>

            <Dropdown  
              class="mb-4" 
              :required="false"           
              :label="trans('deals.labels.main_contact')"
              :options="customers" 
              selectLabel="name"
              name="customer" 
              v-model="form.customer_id"              
            />   

            <MoneyInput class="mb-4" name="value" v-model="form.value" :label="trans('deals.labels.oportunidad_estimated_value')" />
                   
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

  </BaseModal>
</template>

<script setup>
import {reactive, ref, onMounted} from "vue";
import {trans} from "@/helpers/i18n";
import BaseModal from '@/views/components/BaseModal';
import Form from "@/views/components/Form";
import TextInput from "@/views/components/input/TextInput";
import MoneyInput from "@/views/components/input/MoneyInput";
import Dropdown from "@/views/components/input/Dropdown";
import { dealEstimatedCloseDateRange } from "@/stub/statuses";
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

  form.value = form.value.replace(/\D/g, '');

  let data = reduceProperties(form, ['category_id', 'customer_id', 'source_id', 'owner_id', 'estimated_close_date_range'], 'id');
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
  form.source_id = sources.find(option => option.id === form.source?.id);
  form.owner_id = users.find(option => option.id === form.owner?.id);
  form.category_id = dealCategories.find(option => option.id === form.category?.id);
  form.estimated_close_date_range = dealEstimatedCloseDateRange.find(option => option.id === form.estimated_close_date_range);
  
  isLoading.value = false;
});

</script>