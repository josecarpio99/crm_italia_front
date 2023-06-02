<template>
  <BaseModal @close-modal="$emit('close-modal')" @save-modal="onSubmit">
    <template #title>{{ trans('customers.labels.add_person') }}</template>

    <Form id="create-user" @submit.prevent="onSubmit" class="w-[700px] max-w-[100%]">
      <div class="border-b-2 border-gray-100 pb-4">
        <div class="flex gap-2 flex-col lg:flex-row">
          <div class="w-full lg:w-1/2">
            <TextInput class="mb-4" type="text" :required="true" name="name" v-model="form.name" :label="trans('global.labels.name')"/>
          </div>
          <div class="w-full lg:w-1/2">
            <div class="flex flex-col sm:flex-row gap-2">
              <TextInput class="mb-4 w-full lg:w-1/2" type="text" :required="true" name="phone" v-model="form.name" :label="trans('customers.labels.mobile')"/>
              <TextInput class="mb-4 w-full lg:w-1/2" type="text" :required="true" name="phone" v-model="form.name" :label="trans('customers.labels.phone')"/>
            </div>
          </div>
        </div>
      </div>

      <div class="border-b-2 border-gray-100 mt-4">
        <div class="flex gap-2 flex-col lg:flex-row">
          <div class="w-full lg:w-1/2">
            <Dropdown  
              :label="trans('customers.labels.customer_status')"
              :options="customerStatuses" 
              name="customer_status" 
              v-model="form.customer_status"              
            /> 
          </div>
          <div class="w-full lg:w-1/2">
              <TextInput class="mb-4" type="text" :required="true" name="phone" v-model="form.name" :label="trans('customers.labels.mobile')"/>
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
import { customerStatuses } from "@/stub/statuses";

defineEmits(["close-modal"]);

const form = reactive({
  name: '',           
  email: '',
  phone: '',
  mobile: '',
  customer_status: ''
});

function onSubmit() {
  console.log('llego');
}

</script>