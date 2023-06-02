<template>
  <BaseModal @close-modal="$emit('close-modal')">
    <template #title>{{ trans('customers.labels.add_person') }}</template>

    <Form id="create-user" @submit.prevent="onSubmit" class="w-[640px]">
      <TextInput class="mb-4" type="text" :required="true" name="name" v-model="form.name" :label="trans('global.labels.name')"/>             
      <TextInput class="mb-4" type="email" :required="true" name="email" v-model="form.email" :label="trans('global.labels.email')"/>
    </Form>
  </BaseModal>
</template>

<script setup>
import {reactive} from "vue";
import {trans} from "@/helpers/i18n";
import BaseModal from '@/views/components/BaseModal';
import Form from "@/views/components/Form";
import TextInput from "@/views/components/input/TextInput";

defineEmits(["close-modal"]);

const form = reactive({
  name: '',           
  email: '',
});

function onSubmit() {
  console.log('llego');
}

</script>