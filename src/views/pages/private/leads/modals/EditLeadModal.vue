<template>
  <BaseModal :isLoading="isLoading" :show-delete="props.showDelete" @close-modal="onCloseModal" @save-modal="onSubmit" @delete="$emit('delete')">
    <template #title>{{ trans('leads.labels.edit_lead') }}</template>
    <Alert class="mb-4"/>

    <Form ref="formRef" id="update-lead" @submit.prevent="onSubmit" class="w-[700px] max-w-[100%]">
      <div class="border-b-2 border-gray-100 pb-4 mt-4">
        <div class="flex gap-2 flex-col lg:flex-row">
          <div class="w-full lg:w-1/2">
            <Dropdown  
              class="mb-4" 
              :required="true"           
              :label="trans('leads.labels.customer')"
              :options="customers" 
              selectLabel="name"
              name="customer" 
              v-model="form.customer_id"              
            />  

            <Dropdown  
              class="mb-4"  
              :required="true"          
              :label="trans('leads.labels.status')"
              :options="leadStatuses" 
              name="status" 
              v-model="form.status"              
            />           
          </div>
          <div class="w-full lg:w-1/2">
            <Dropdown  
              class="mb-4"
              :required="true"
              :label="trans('leads.labels.owner')"
              selectLabel="name"
              name="owner" 
              :options="users" 
              v-model="form.owner_id"              
            />  

            <Dropdown  
              :required="true"
              class="mb-4"
              :label="trans('leads.labels.source')"
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
              :label="trans('leads.labels.requirement_size')"
              :options="leadRequirementSize" 
              name="requirement_size" 
              v-model="form.requirement_size"              
            /> 
            <Dropdown  
              class="mb-4"
              :label="trans('leads.labels.profile')"
              :options="leadProfile" 
              name="profile" 
              v-model="form.profile"              
            /> 

            <TextInput type="textarea" class="mb-4" :required="false" name="quotation_list" v-model="form.quotation_list" :label="trans('leads.labels.quotation_list')"/>

            <TextInput type="text" :required="false" name="showroom" v-model="form.showroom" :label="trans('leads.labels.showroom')"/>


          </div>
          <div class="w-full lg:w-1/2">  
            <Dropdown  
              class="mb-4"
              :required="true"
              :label="trans('leads.labels.category')"
              :options="leadCategories" 
              name="category" 
              v-model="form.category_id"              
            />

            <TextInput class="mb-4" type="textarea" :required="false" name="requirement" v-model="form.requirement" :label="trans('leads.labels.requirement')"/>

            <TextInput type="datetime-local" :required="false" name="appointment_at" v-model="form.appointment_at" :label="trans('leads.labels.appointment_at')"/>


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
import { leadStatuses, leadProfile, leadRequirementSize } from "@/stub/statuses";
import { leadCategories } from "@/stub/categories";
import LeadService from "@/services/LeadService";
import SectorService from "@/services/SectorService";
import CountryService from "@/services/CountryService";
import Alert from "@/views/components/Alert";
import {clearObject, fillObject, reduceProperties, removeEmpty} from "@/helpers/data";
import {useAlertStore} from "@/stores";
import {useUsersStore} from "@/stores/users";
import {useCustomersStore} from "@/stores/customers";
import {useSourcesStore} from "@/stores/sources";

const props = defineProps({  
  lead: {
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

const leadService = new LeadService();
const sectorService = new SectorService();
const countryService = new CountryService();
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
  let data = reduceProperties(form, ['status', 'profile', 'category_id', 'customer_id', 'source_id', 'owner_id', 'requirement_size'], 'id');
  leadService.handleUpdate(
      'update-lead', 
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
  Object.assign(form, props.lead);
  
  form.customer_id = customers.find(option => option.id === form.customer?.id);
  form.source_id = sources.find(option => option.id === form.source?.id);
  form.owner_id = users.find(option => option.id === form.owner?.id);
  form.category_id = leadCategories.find(option => option.id === form.category?.id);
  form.status = leadStatuses.find(option => option.id === form.status);
  form.profile = leadProfile.find(option => option.id === form.profile);
  form.requirement_size = leadRequirementSize.find(option => option.id === form.requirement_size);
  
  isLoading.value = false;
});

</script>