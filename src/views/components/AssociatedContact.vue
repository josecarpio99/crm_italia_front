<template>
  <div class="rounded-md border-2 mt-2">
    <div class="flex items-center border-b-[1px] py-2 pl-4 pr-6 cursor-pointer hover:bg-gray-100"
      @click="isOpen = !isOpen">
      <Icon name="user-o" class="basis-1/12 text-gray-500 cursor-pointer" />
      <div class="basis-full">
        <h5 class="font-semibold">{{ trans('global.labels.associated_contact') }}</h5>
      </div>
      <div class="text-right basis-2/12 flex justify-between items-center">
        <div>
          <!-- <Icon 
            name="plus" 
            class="text-gray-500 cursor-pointer hover:text-blue-300"
          /> -->
        </div>
        <Icon :name="isOpen ? 'angle-up' : 'angle-down'" class="text-gray-500" />
      </div>
    </div>

    <div v-if="isOpen" class="flex items-center justify-center p-2">
      <ul 
        v-if="customer"
        class="w-full"
      >
        <li class="flex flex-col px-2 pt-2 pb-2 pl-4">
          <router-link 
            class="font-semibold text-blue-500 hover:text-blue-700 hover:underline mb-4"
            :to="{name: 'customers.show', params: {id: customer.id}}"
          >
            {{ customer.name }}
          </router-link>
          <div class="flex items-center mb-2" v-if="customer.mobile">
            <Icon 
              class="mr-2 align-middle" 
              :name="'phone'" 
            />
            <span>{{ customer.mobile }}</span>
          </div>
          <div class="flex items-center" v-if="customer.email">
            <Icon 
              class="mr-2 align-middle" 
              :name="'envelope-o'" 
            />
            <span>{{ customer.email }}</span>
          </div>
        </li>      
      </ul>
      <p v-else class="text-gray-500 my-4">{{ trans('global.labels.without_associated_contact') }}</p>

    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {trans} from '@/helpers/i18n';
import Icon from "@/views/components/icons/Icon";

const props = defineProps({
  customer: {
    type: Object,
    default: null
  }
});

const isOpen = ref(true);

</script>

<style>

</style>