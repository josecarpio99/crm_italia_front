<template>
  <th scope="col"
    class="align-middle group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="column.class">

    <div class="leading-loose inline-block">{{ column.label }}</div>
    <div class="sort-arrows inline-block text-center absolute" v-if="column.sorteable">
      <span @click.prevent="onSortChange(column.key, 'asc')" :class="sortControlClasses(column.key, 'asc')"
        class="w-full block cursor-pointer font-normal hover:font-bold focus:font-bold hover:text-theme-600 focus:text-theme-600 dark:hover:text-theme-500 dark:focus:text-theme-500"><i
          class="fa fa-caret-up"></i></span>
      <span @click.prevent="onSortChange(column.key, 'desc')" :class="sortControlClasses(column.key, 'desc')"
        class="w-full block cursor-pointer font-normal hover:font-bold focus:font-bold hover:text-theme-600 focus:text-theme-600 dark:hover:text-theme-500 dark:focus:text-theme-500"><i
          class="fa fa-caret-down"></i></span>
    </div>

    <div v-if="column.filterable" class="inline-block float-right invisible group-hover:visible">
      <span class="flex mt-[1px] text-base cursor-pointer hover:text-gray-700">
        <i class="fa fa-filter"></i>
      </span>
    </div>
  </th>
</template>

<script setup>
import { reactive } from "vue";
import Dropdown from "@/views/components/input/Dropdown";

const props = defineProps({
  column: {
    type: Object,
    required: true
  },
  currentSort: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['sort-change']);

function onSortChange(column, direction) {
  emit('sort-change', {column, direction})
}

function sortControlClasses(column, direction) {
  if (props.currentSort.column === column && props.currentSort.direction === direction) {
    return 'text-theme-500'
  }
  return '';
}

</script>

<style lang="scss" scoped>

</style>