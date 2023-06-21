<template>
  <h4 class="text-xl text-gray-600 mb-4">{{ trans('global.labels.smart_lists') }}</h4>
  <div v-if="props.items.length > 0" class="flex flex-wrap gap-4">
      <router-link 
      v-for="item in props.items" 
      class="p-6 border-2 grow-0 rounded-sm basis-[31%]  hover:shadow-xl cursor-pointer"
      :class="{'border-blue-300': route.params.id == item.id}"
      :to="{name: props.routeName, params: {id: item.id}}"
      >                      
        <h4 class="text-2xl">{{ item.name }}</h4> 
      </router-link>

  </div>

  <div v-else class="flex items-center justify-center p-10">
    <span class="text-lg text-gray-500">{{ trans('global.phrases.no_records') }}</span>
  </div>
</template>

<script setup>
import {useRoute} from "vue-router";
import {trans} from "@/helpers/i18n";

const props = defineProps({
  items: {
    type: Array
  },
  routeName: {
    type: String,
    required: true
  }
});

const route = useRoute();

</script>

<style lang="scss" scoped>

</style>