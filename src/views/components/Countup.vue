<template>
  <div class="text-red-400 text-xl font-semibold" :class="props.class">
    {{ diff }}
  </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";

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

console.dir(new Date());

// const diff = computed(() => timeDiff());
const diff = ref(null);
const dateDiffMS = ref(new Date(props.date).getTime());
let interval = null;

function timeDiff() {
  let now = new Date().getTime();
  
  // Find the distance between now and the count down date
  let distance = now - dateDiffMS.value;
    
  // Time calculations for days, hours, minutes and seconds
  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
  // Output the result in an element with id="demo"
  
  diff.value = `
    ${(days > 0) ? days + "d " : ''}
    ${(hours > 0) ? hours + "h " : ''}
    ${minutes + "m "} 
    ${seconds + "s "}
  `;
}

onMounted(() => {
  interval = setInterval(() => {
    timeDiff();
  }, 1000);
})

onUnmounted(() => {
  clearInterval(interval);
}) 
</script>