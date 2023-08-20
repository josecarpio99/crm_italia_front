<template>
  <BaseModal :isLoading="isLoading" :show-delete="props.showDelete" @close-modal="onCloseModal" @save-modal="onSubmit" @delete="$emit('delete')">
    <template #title>{{ trans('leads.labels.edit_lead') }}</template>
    <Alert class="mb-4"/>

    <Form ref="formRef" id="update-lead" @submit.prevent="onSubmit" class="w-[700px] max-w-[100%]">
      <div class="border-b-2 border-gray-100 pb-4">
        <div class="flex gap-2 flex-col ">
         
          <div class="w-full ">
            <TextInput 
              class="mb-4" 
              type="text" 
              :required="true"
              name="name" 
              v-model="form.name" 
              :label="trans('global.labels.name')"
              :errorMessage="v$.name.$errors.length ? v$.name.$errors[0].$message : ''"
            />            

            <TextInput class="mb-4" type="text" :required="false" name="position" v-model="form.position" :label="trans('leads.labels.position')"/>

            <Dropdown  
              class="mb-4"            
              :label="trans('leads.labels.sector')"
              selectLabel="name"
              :options="sectors" 
              name="sector" 
              v-model="form.sector_id"              
            /> 

          </div>
          
          <div class="w-full ">
            <!-- <div class="flex flex-col sm:flex-row gap-2">
            </div> -->
            <TextInput 
              class="mb-4 w-full " 
              type="text" 
              :required="false" 
              name="mobile" 
              v-model="form.mobile" 
              :label="trans('leads.labels.mobile')"
            />

            <TextInput class="mb-4 w-full " type="text" :required="false" name="phone" v-model="form.phone" :label="trans('leads.labels.phone')"/>

            <Dropdown  
              :required="true"
              class="mb-4"
              :label="trans('leads.labels.source')"
              selectLabel="name"
              name="source" 
              :options="sources" 
              v-model="form.source_id"   
              :errorMessage="v$.source_id.$errors.length ? v$.source_id.$errors[0].$message : ''"
            /> 

            <TextInput 
              class="mb-4" 
              type="email" 
              :required="false"
              name="email" 
              v-model="form.email" 
              :label="trans('users.labels.email')"
             />
            

            <!-- <div class="flex flex-col sm:flex-row gap-2">
            </div> -->
            <TextInput 
              class="mb-4 w-full " 
              type="text" 
              :required="true" 
              name="city" 
              v-model="form.city" 
              :label="trans('leads.labels.city')"
              :errorMessage="v$.city.$errors.length ? v$.city.$errors[0].$message : ''"
            />

            <TextInput class="mb-4 w-full " type="text" :required="false" name="postcode" v-model="form.postcode" :label="trans('leads.labels.postcode')"/>

            <!-- <div class="flex flex-col sm:flex-row gap-2">
            </div> -->
            <TextInput class="mb-4 w-full " type="text" :required="false" name="state" v-model="form.state" :label="trans('leads.labels.state')"/>

            <Dropdown  
              class="mb-4 w-full "            
              :label="trans('leads.labels.country')"
              selectLabel="name"
              :options="countries" 
              name="country" 
              v-model="form.country_id"              
            /> 

          </div>

        </div>
      </div>

      <div class="border-b-2 border-gray-100 pb-4 mt-4">
        <div class="flex gap-2 flex-col ">
          <div class="w-full ">
            
            <Dropdown  
              class="mb-4"  
              :required="true"          
              :label="trans('leads.labels.status')"
              :options="leadStatuses" 
              name="status" 
              v-model="form.status"    
              :errorMessage="v$.status.$errors.length ? v$.status.$errors[0].$message : ''"
            />           
          </div>
          <div class="w-full ">
            <Dropdown  
              class="mb-4"
              :required="true"
              :label="trans('global.labels.adviser_in_charge')"
              selectLabel="name"
              name="owner" 
              :options="users" 
              v-model="form.owner_id"   
              :errorMessage="v$.owner_id.$errors.length ? v$.owner_id.$errors[0].$message : ''"

            />
                                 
          </div>
        </div>
      </div>

      <div class="border-b-2 border-gray-100 mt-4">
        <div class="flex gap-2 flex-col ">
          <div class="w-full ">
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
          <div class="w-full ">  
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
import {useSourcesStore} from "@/stores/sources";
import $date from "@/helpers/date";
import useVuelidate from '@vuelidate/core';
import {
  required,
  maxLength,  
  helpers
} from '@vuelidate/validators';

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

const rules = {
  name: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  },
  status: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  }, 
  source_id: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  }, 
  owner_id: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  }, 
  city: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  }, 
  category_id: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  }, 
}

const v$ = useVuelidate(rules, form);

const leadService = new LeadService();
const sectorService = new SectorService();
const countryService = new CountryService();
const alertStore = useAlertStore();
const usersStore = useUsersStore();
const sourcesStore = useSourcesStore();
const formRef = ref(null);
const isLoading = ref(true);

let sources = sourcesStore.sourceList;
let sectors = null;
let users = usersStore.userList;
let countries = null;

function onSubmit() {  
  alertStore.clear();
  
  v$.value.$touch();

  if (v$.value.$invalid) {
    return true
  }

  v$.value.$reset();

  let data = reduceProperties(form, ['status', 'profile', 'category_id', 'sector_id', 'source_id', 'owner_id', 'requirement_size', 'country_id'], 'id');
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
  sectors = await sectorService.index().then(res => res.data);
  countries = await countryService.index().then(res => res.data);

  Object.assign(form, props.lead);
  
  form.appointment_at = $date(props.lead.appointment_at).format('YYYY-MM-DDThh:mm');
  form.sector_id = sectors.find(option => option.id === form.sector?.id);
  form.country_id = countries.find(option => option.id === form.country?.id);
  form.source_id = sources.find(option => option.id === form.source?.id);
  form.owner_id = users.find(option => option.id === form.owner?.id);
  form.category_id = leadCategories.find(option => option.id === form.category?.id);
  form.status = leadStatuses.find(option => option.id === form.status);
  form.profile = leadProfile.find(option => option.id === form.profile);
  form.requirement_size = leadRequirementSize.find(option => option.id === form.requirement_size);
  
  isLoading.value = false;
});

</script>