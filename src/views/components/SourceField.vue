<template>
  <span 
    class="text-gray-600 font-bold p-2 rounded-lg"
    :class="{
      'bg-orange-300': value == 'Prospección',
      'bg-lime-300': value == 'Publicidad',
      'bg-cyan-300': value == 'Recompra',
      'bg-violet-300': value == 'Referido',
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