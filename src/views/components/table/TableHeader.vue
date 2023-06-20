<template>
  <th scope="col"
    class="align-middle group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="column.class">

    <div class="leading-loose inline-block">{{ column.label }}</div>
    <div class="sort-arrows inline-block text-center align-text-bottom" v-if="column.sorteable">
      <span @click.prevent="onSortChange(column.key, 'asc')" :class="sortControlClasses(column.key, 'asc')"
        class="w-full block cursor-pointer font-normal hover:font-bold focus:font-bold hover:text-theme-600 focus:text-theme-600 dark:hover:text-theme-500 dark:focus:text-theme-500"><i
          class="fa fa-caret-up"></i></span>
      <span @click.prevent="onSortChange(column.key, 'desc')" :class="sortControlClasses(column.key, 'desc')"
        class="w-full block cursor-pointer font-normal hover:font-bold focus:font-bold hover:text-theme-600 focus:text-theme-600 dark:hover:text-theme-500 dark:focus:text-theme-500"><i
          class="fa fa-caret-down"></i></span>
    </div>

    <div 
      v-if="column.filterable" 
      class="inline-block float-right invisible group-hover:visible"
    >
      <span @click="handleClick"  class="flex mt-[1px] text-base cursor-pointer hover:text-gray-700">
        <i class="fa fa-filter"></i>
      </span>
    </div>

    <VDropdown
      v-if="column.filterable" 
      :auto-size="false"
      :triggers="[]"
      :shown="showInput"
      :prevent-overflow="false"
      :placement="'auto'"
      :popperClass="`table-header ${['select', 'multiselect', 'radio'].includes(column.filter.type) ? 'with-select' : ''}`"
      @hide="handleBlur"
     >
        <template #popper>    
          <TextInput 
            v-if="column.filter.type == 'input'"
            class="mb-4" type="text" name="filter" v-model="inputValue" 
            :label="$t('global.labels.filter')"
          />
          
          <Dropdown  
            v-else-if="['select', 'multiselect', 'radio'].includes(column.filter.type)"
            :open="true"
            :options="column.filter.options"
            :selectLabel="column.filter.optionsLabel"
            name="type" 
            v-model="inputValue" 
            :label="$t('global.labels.filter')"
            :showLabel="true"
            :showPointer="false"
            :placeholder="'Buscar...'"
            :multiple="column.filter.type == 'multiselect'"

          /> 

        </template>
    </VDropdown>
  </th>
</template>

<script setup>
import { reactive, ref, watch, computed } from "vue";
import Dropdown from "@/views/components/input/Dropdown";
import TextInput from "@/views/components/input/TextInput";


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

const emit = defineEmits(['sort-change', 'filter-change', 'update:modelValue']);

const showInput = ref(false);
const inputValue = ref(props.column.filter?.modelValue); 


watch(inputValue, (newValue) => {  
  inputValue.value = newValue;   
  emit('filter-change', {column: props.column, value: newValue});
});

function onSortChange(column, direction) {
  emit('sort-change', {column, direction})
}

function sortControlClasses(column, direction) {
  if (props.currentSort.column === column && props.currentSort.direction === direction) {
    return 'text-theme-500'
  }
  return '';
}

function handleClick()
{
  showInput.value = true;  
}

function handleBlur()
{        
  showInput.value = false;
}

</script>

<style lang="scss" scoped>
.v-popper__inner {
  overflow-y: visible !important;
}

// .v-popper--theme-dropdown {
//   padding: 16px !important;
// }
</style>