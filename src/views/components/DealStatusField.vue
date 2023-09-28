<template>
  <span 
    class="text-gray-600 font-bold p-2 rounded-lg"
    :class="{
      'bg-green-300': value == 'vendido',
      'bg-red-300': value == 'perdido',
      'bg-gray-200': value == 'en proceso'
    }"
  >
    {{ value }}
  </span>   
</template>

<script setup>

const props = defineProps({
  value: {
    required: true
  }
});

</script>