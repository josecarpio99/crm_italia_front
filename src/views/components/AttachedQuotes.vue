<template>
  <div class="rounded-md border-2 mt-2">
    <div class="flex items-center border-b-[1px] py-2 pl-4 pr-6 cursor-pointer hover:bg-gray-100"
      @click="isOpen = !isOpen">
      <Icon name="files-o" class="basis-1/12 text-gray-500 cursor-pointer" />
      <div class="basis-full">
        <h5 class="font-semibold">
          <slot name="title">{{ trans('deals.labels.attached_quotes') }}</slot>
        </h5>
      </div>
      <div class="text-right basis-2/12 flex justify-end items-center">       
        <Icon :name="isOpen ? 'angle-up' : 'angle-down'" class="text-gray-500" />
      </div>
    </div>

    <div v-if="isOpen" class="flex items-center justify-center p-2">
      <ul 
        v-if="quotes.length > 0"
        class="w-full"
      >
        <li 
          v-for="quote in quotes" :key="quote.id"
          class="flex items-end px-2 pb-2 group"
        >
          <div class="flex items-center">
            <Icon 
              name="file-o" 
              class="text-gray-500 cursor-pointer mr-2"
            />
            <div class="flex flex-col">
              <span 
                class="cursor-pointer whitespace-normal break-all text-blue-500"
                @click="selectedQuote = quote; showFile = true;"
              >
                {{ quote.code }}
              </span>
              <span class="text-xs text-gray-500">{{ $date(quote.created_at).format() }}</span>
            </div>
          </div>

          <div class="flex justify-end items-center ml-auto text-blue-600 invisible group-hover:visible">
            <a :href="quote.url" target="_blank">
              <Icon 
                name="cloud-download" 
                class="cursor-pointer mr-2"
              />
            </a>       
          </div>
        </li>
      </ul>
      <p v-else class="text-gray-500 my-4">{{ trans('global.labels.without_documents') }}</p>
    </div>

    <Modal :is-showing="showFile" @close="showFile = false; selectedQuote = null" class="max-w-none">
      <iframe 
        v-if="selectedQuote"
        class="w-full min-h-[90vh] mx-auto" 
        :src="selectedQuote?.url" 
      >
      </iframe>
    </Modal>
  </div>  
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue';
import useVuelidate from '@vuelidate/core';
import {
  required,
  maxLength,  
  helpers
} from '@vuelidate/validators';
import {trans} from '@/helpers/i18n';
import {useAuthStore} from "@/stores/auth";
import Icon from "@/views/components/icons/Icon";
import toast from '@/helpers/toast';
import alertHelpers from "@/helpers/alert";
import Button from "@/views/components/input/Button";
import Modal from "@/views/components/Modal";
import Panel from "@/views/components/Panel";
import $date from "@/helpers/date";

defineProps({
  quotes: {
    type: Array,
    default: []
  }
})

const selectedQuote = ref(null);
const isOpen = ref(true);
const showModal = ref(false);
const showFile = ref(false);

</script>