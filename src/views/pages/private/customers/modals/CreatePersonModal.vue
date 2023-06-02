<template>
  <BaseModal @close-modal="$emit('close-modal')" @save-modal="onSubmit">
    <template #title>{{ trans('customers.labels.add_person') }}</template>

    <Form id="create-user" @submit.prevent="onSubmit" class="w-[700px] max-w-[100%]">
      <div class="border-b-2 border-gray-100 pb-4">
        <div class="flex gap-2 flex-col lg:flex-row">
         
          <div class="w-full lg:w-1/2">
            <TextInput class="mb-4" type="text" :required="true" name="name" v-model="form.name" :label="trans('global.labels.name')"/>
            
            <TextInput class="mb-4" type="text" name="company" :label="trans('Por definir')"/>

            <TextInput class="mb-4" type="text" :required="false" name="position" v-model="form.position" :label="trans('customers.labels.position')"/>

          </div>
          
          <div class="w-full lg:w-1/2">
            <div class="flex flex-col sm:flex-row gap-2">
              <TextInput class="mb-4 w-full lg:w-1/2" type="text" :required="true" name="mobile" v-model="form.mobile" :label="trans('customers.labels.mobile')"/>
              <TextInput class="mb-4 w-full lg:w-1/2" type="text" :required="false" name="phone" v-model="form.phone" :label="trans('customers.labels.phone')"/>
            </div>
            <TextInput class="mb-4" type="email" :required="true" name="email" v-model="form.email" :label="trans('users.labels.email')"/>

            <div class="flex flex-col sm:flex-row gap-2">
              <TextInput class="mb-4 w-full lg:w-1/2" type="text" :required="true" name="city" v-model="form.city" :label="trans('customers.labels.city')"/>
              <TextInput class="mb-4 w-full lg:w-1/2" type="text" :required="false" name="postcode" v-model="form.postcode" :label="trans('customers.labels.postcode')"/>
            </div>

          </div>

        </div>
      </div>

      <div class="border-b-2 border-gray-100 pb-4 mt-4">
        <div class="flex gap-2 flex-col lg:flex-row">
          <div class="w-full lg:w-1/2">
            <Dropdown  
              :label="trans('customers.labels.customer_status')"
              :options="customerStatuses" 
              name="customer_status" 
              v-model="form.customer_status"              
            /> 
            <Dropdown  
              :label="trans('customers.labels.potential_customer_status')"
              :options="potentialCustomerStatuses" 
              name="potential_customer_status" 
              v-model="form.potential_customer_status"              
            />
          </div>
          <div class="w-full lg:w-1/2">
            <TextInput class="mb-4" type="text" name="owner" :label="trans('Por definir')"/>
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
import {reactive} from "vue";
import {trans} from "@/helpers/i18n";
import BaseModal from '@/views/components/BaseModal';
import Form from "@/views/components/Form";
import TextInput from "@/views/components/input/TextInput";
import Dropdown from "@/views/components/input/Dropdown";
import { customerStatuses, potentialCustomerStatuses } from "@/stub/statuses";
import { customerCategories } from "@/stub/categories";
import CustomerService from "@/services/CustomerService";
import {clearObject, reduceProperties} from "@/helpers/data";

defineEmits(["close-modal"]);

const form = reactive({
  is_company: 0,
  name: '',           
  email: '',
  phone: '',
  mobile: '',
  website: '',
  origin: '',
  category_id: null,
  owner_id: null,
  position: '',
  city: '',
  postcode: '',
  customer_status: '',
  potential_customer_status: '',
});

const service = new CustomerService();

function onSubmit() {
  console.log(reduceProperties(form, ['customer_status', 'potential_customer_status', 'category_id'], 'id', true));

  service.handleCreate(
      'create-user', 
      reduceProperties(form, ['customer_status', 'potential_customer_status', 'category_id'], 'id')
    ).then((res) => {                
    if (res?.status == 200 || res?.status == 201) {
        clearObject(form)
    }
  })
  
  return false;
}

</script>