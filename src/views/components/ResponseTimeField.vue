<template>
  <span 
    class="text-gray-600 font-bold p-2 rounded-lg"
    :class="{
      'bg-green-300': $diffInMin <= 60,
      'bg-yellow-300': $diffInMin > 60 && $diffInMin <= 90,
      'bg-red-300': $diffInMin > 90
    }"
  >
    {{ display }}
  </span>   
</template>

<script setup>
import {computed} from "vue";
import {timeDiff} from "@/helpers/date";
import dayjs from "dayjs";

const props = defineProps({
  value: {
    required: true
  },
  compDate: {
    required: true
  },
});

const $diffInMin = computed(() => diffInMin(props.value));

const display = computed(() => timeDiff(props.compDate, props.value));

function diffInMin() {
  console.log(dayjs(props.value).diff(props.compDate, 'minutes'));
  return dayjs(props.value).diff(props.compDate, 'minutes')
}

</script>