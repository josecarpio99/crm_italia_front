<template>
  <li class="flex items-center p-2">
    <div class="flex flex-col">
      <VDropdown
        :triggers="[]"
        placement="left"
        :shown="showDropdown"
        @hide="showDropdown = false"
      >
        <span 
          class="text-blue-500 whitespace-normal leading-4 cursor-pointer"
          @click.stop="showDropdown = !showDropdown"
        >
          {{ contact.name }}
        </span>
        <template #popper>
          <ContactForm class="w-96 p-6" :contact="contact" @submit="onSubmit" />
        </template>
      </VDropdown>
    </div>

    <!-- <Icon 
      name="trash-o" 
      class="text-red-500 cursor-pointer ml-auto"
      @click="deletecontact(contact)"
    /> -->
  </li>
</template>

<script setup>
import {reactive, ref} from 'vue';
import {trans} from '@/helpers/i18n';
import Icon from "@/views/components/icons/Icon";
import toast from '@/helpers/toast';
import alertHelpers from "@/helpers/alert";
import ContactForm from "@/views/components/contact/ContactForm";

const props = defineProps({
  contact: {
    required: true,
    type: Object
  }
});

const emit = defineEmits(['update']);

const showDropdown = ref(false);

function deletecontact(contact) {
  alertHelpers.confirmDanger(function () {
    
  });
}

function onSubmit(params) {
  emit('update', {data: params, id: props.contact.id});
};
</script>

<style>

</style>