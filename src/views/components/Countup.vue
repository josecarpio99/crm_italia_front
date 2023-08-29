<template>
  <div class="text-red-400 text-xl font-semibold" :class="props.class">
    {{ diff }}
  </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {timeDiff} from "@/helpers/date";

const props = defineProps({
  date: {
    required: true,
    type: String
  },
  class: {
    type: String,
    default: null
  }
})


const diff = ref(null);
// const dateDiffMS = ref(new Date(props.date).getTime());
let interval = null;

// function timeDiff(date) {
//   let dateDiffMS = ref(new Date(date).getTime());
//   let now = new Date().getTime();
  
//   let distance = now - dateDiffMS.value;
    
//   let days = Math.floor(distance / (1000 * 60 * 60 * 24));
//   let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//   let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//   let seconds = Math.floor((distance % (1000 * 60)) / 1000);    

//   return `
//     ${(days > 0) ? days + "d " : ''}
//     ${(hours > 0) ? hours + "h " : ''}
//     ${minutes + "m "} 
//     ${seconds + "s "}
//   `;  
// }

onMounted(() => {
  interval = setInterval(() => {
    diff.value = timeDiff(props.date);
  }, 1000);
})

onUnmounted(() => {
  clearInterval(interval);
}) 
</script>