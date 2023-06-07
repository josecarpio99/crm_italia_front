<template>
  <th v-for="(column, i) in columns" scope="col"
    class="align-middle px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="column.class">
    <slot :name="'column-' + i">
      <div class="leading-loose inline-block">{{ column.label }}</div>
      <div class="sort-arrows inline-block text-center absolute" v-if="column.sorteable">
        <span @click.prevent="onSortChange(column.key, 'asc')" :class="sortControlClasses(i, 'asc')"
          class="w-full block cursor-pointer font-normal hover:font-bold focus:font-bold hover:text-theme-600 focus:text-theme-600 dark:hover:text-theme-500 dark:focus:text-theme-500"><i
            class="fa fa-caret-up"></i></span>
        <span @click.prevent="onSortChange(column.key, 'desc')" :class="sortControlClasses(i, 'desc')"
          class="w-full block cursor-pointer font-normal hover:font-bold focus:font-bold hover:text-theme-600 focus:text-theme-600 dark:hover:text-theme-500 dark:focus:text-theme-500"><i
            class="fa fa-caret-down"></i></span>
      </div>
    </slot>
  </th>
</template>

<script setup>
import Dropdown from "@/views/components/input/Dropdown";

const props = defineProps([
  column: {
    type: Object,
    required: true
  }
]);

const emit = defineEmits('sort-change');

function onSortChange(column, direction) {
  emit('sort-change', {column, direction})
}

</script>

<style lang="scss" scoped>

</style>