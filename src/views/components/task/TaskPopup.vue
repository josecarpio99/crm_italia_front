<template>
  <VDropdown 
    :auto-size="false"
    :triggers="[]"
    :shown="showDropdown"
    :prevent-overflow="false"
    :placement="'auto'" 
    :skidding="-10"
    :distance="15"
    :arrow-padding="6"
    @hide="showDropdown = false"
  >
    <Icon 
      name="plus" 
      class="text-gray-500 cursor-pointer hover:text-blue-300" 
      @click.stop="showDropdown = !showDropdown"
    />

    <template #popper>    
      <TaskForm 
        class="w-96 p-6"
        @submit="onTaskFormSubmit"
      />
    </template>
  </VDropdown> 
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue';
import TaskForm from "@/views/components/task/TaskForm";
import Icon from "@/views/components/icons/Icon";

const emit = defineEmits(['submit']);

const showDropdown = ref(false);

function onTaskFormSubmit(params) {
  showDropdown.value = false;

  emit('submit', params);
}
</script>