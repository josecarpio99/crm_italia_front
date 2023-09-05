<template>  
  <div class="flex gap-2">
    <div>
        <Icon 
          v-if="!task || !dayjs().isBefore(dayjs(task.due_at))"
          class="text-red-500 text-2xl" 
          name="exclamation-circle" 
        />
    </div> 

    <div v-if="task">
      <div>
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

    </div> 

  </div>

     
</template>

<script setup>
import Icon from "@/views/components/icons/Icon";
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