<template>  
  <div v-if="task">
    <p class="uppercase">
      {{ limitStr(task.content) }}
    </p>
    <p 
      class="text-xs"
      :class="dayjs().isBefore(dayjs(task.due_at)) ? 'text-gray-500' : 'text-red-500'"
    >
      Vencimiento: 
      <span>
        {{ $date(task.due_at).format('DD-MM-YYYY') }}
      </span>   
      <span> . </span>
      <span>{{ task.owner?.name }}</span>   
    </p>
  </div>    
</template>

<script setup>
import { limitStr } from "@/helpers/data";
import $date from "@/helpers/date";
import dayjs from "dayjs";

const props = defineProps({
  task: {
    type: Object,
    default: null
  }
});

</script>