<template>
  <BaseModal :isLoading="isLoading" @close-modal="onCloseModal" @save-modal="onSubmit">
    <template #title>{{ trans('leads.phrases.sure_to_convert', {name: lead.name}) }}</template>
    <Alert class="mb-4"/>

    <Form ref="formRef" id="convert-lead" @submit.prevent="onSubmit" class="w-[700px] max-w-[100%]">
      <div class="border-b-2 border-gray-100 pb-4">
        <div class="flex gap-2 flex-col ">

          <div class="rounded-md bg-gray-100 p-2 mb-2">
            <p class="text-gray-600 text-xs mb-2"><span class="font-bold">Nota:</span> Recuerda que al convertir un lead en contacto, el lead se borra del CRM y se reemplaza por un contacto.</p> 

          </div>
         
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

          <Dropdown  
            :required="false"
            class="mb-4 deal_source"
            :label="trans('leads.labels.lead_source')"
            selectLabel="name"
            name="source" 
            :options="sourcesStore.sourceList" 
            v-model="form.source_id"      
            :errorMessage="v$.source_id.$errors.length ? v$.source_id.$errors[0].$message : ''"
          />

          <TextInput 
            class="mb-4" 
            type="text" 
            :required="false" 
            name="city" 
            v-model="form.city" 
            :label="trans('customers.labels.city')"
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
import { customerCategories } from "@/stub/categories";
import LeadService from "@/services/LeadService";
import Alert from "@/views/components/Alert";
import {clearObject, reduceProperties} from "@/helpers/data";
import {useAlertStore} from "@/stores";
import {useUsersStore} from "@/stores/users";
import {useAuthStore} from "@/stores/auth";
import {useSourcesStore} from "@/stores/sources";
import useVuelidate from '@vuelidate/core';
import {
  required,
  maxLength,  
  helpers
} from '@vuelidate/validators';

const emit = defineEmits(["close-modal"]);

const props = defineProps({
  lead: {
    required: true,
    type: Object
  }
});

const initialState = {
  company_name: '',           
  name: '',           
  email: '',
  mobile: '',
  city: '',
  category_id: null,
  source_id: null,
  owner_id: null
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

const v$ = useVuelidate(rules, form);

const leadService = new LeadService();
const alertStore = useAlertStore();
const usersStore = useUsersStore();
const authStore = useAuthStore();
const sourcesStore = useSourcesStore();

const formRef = ref(null);
const isLoading = ref(true);
let users = usersStore.userList;

function onSubmit() {  
  alertStore.clear();
  
  v$.value.$touch();

  if (v$.value.$invalid) {
    return true
  }

  v$.value.$reset();

  leadService.convert(
      props.lead.id, 
      reduceProperties(form, ['category_id','owner_id', 'source_id'], 'id')
    ).then((res) => {                
    if (res?.status == 200 || res?.status == 201) {
        router.push({name: 'customers.show', params: {id: res.data.data.id}});
    }
  })
  
  return false;
}

function onCloseModal() {
  emit('close-modal');
}

onMounted( async () => {

  form.owner_id = users.find(option => option.id === props.lead.owner?.id);
  form.category_id = customerCategories.find(option => option.id === props.lead.category?.id);
  form.source_id = sourcesStore.sourceList.find(option => option.id === props.lead.source?.id);

  form.company_name = props.lead.company_name;
  form.name = props.lead.name;
  form.email = props.lead.email;
  form.city = props.lead.city;
  form.mobile = props.lead.mobile;
  isLoading.value = false;
});

</script>