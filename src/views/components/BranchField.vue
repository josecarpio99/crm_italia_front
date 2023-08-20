<template>
  <span 
    class="text-gray-600 font-bold p-2 rounded-lg"
    :class="{
      'bg-amber-200': value == 'CDMX',
      'bg-teal-200': value == 'AGS',
      'bg-indigo-200': value == 'MTY',
      'bg-fuchsia-200': value == 'QRO',
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