<template>
  <div class="rounded-md border-2 mt-2">
    <div 
      class="flex items-center border-b-[1px] py-2 pl-4 pr-6 cursor-pointer hover:bg-gray-100"
      @click="isOpen = !isOpen"
    >
      <Icon name="check-square-o" class="basis-1/12 text-gray-500 cursor-pointer" />
      <div class="basis-full">
        <h5 class="font-semibold">{{ trans('global.labels.active_tasks') }}</h5>
        <p class="text-xs text-gray-500 mt-1">{{ trans('global.labels.without_active_tasks') }}</p>
      </div>
      <div class="text-right basis-2/12 flex justify-between">
        <Icon name="plus" class="text-gray-500 cursor-pointer hover:text-blue-300" />
        <Icon :name="isOpen ? 'angle-up' : 'angle-down'" class="text-gray-500" />        
      </div>
    </div>

    <div v-if="isOpen" class="flex items-center justify-center p-2">
      <p class="text-gray-500 my-4">{{ trans('global.labels.without_tasks') }}</p>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {trans} from '@/helpers/i18n';
import Icon from "@/views/components/icons/Icon";

const isOpen = ref(true);

// function toggleOpen() {

// }
</script>

<style lang="scss" scoped>

</style>