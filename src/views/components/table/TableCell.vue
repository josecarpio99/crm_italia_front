<template>
  <td class="px-6 py-4 whitespace-nowrap text-sm editable">
     <div :class="{hidden:showInput}">
      <slot />
      <span 
        @click="handleClick" 
        class="cursor-pointer hidden text-gray-400 hover:text-gray-700 ml-2"
      >
        <i class="fa fa-pencil"></i>
      </span>
     </div>

     <input type="text" ref="inputElement" @blur="handleBlur" @keypress.enter="handleEnter"
     v-model="inputValue" class="border text-sm border-gray focus:outline-none focus:ring focus:ring-transparent focus:border-gray-500" :class="`${showInput ? 'block' : 'hidden'}`">
  </td>
</template>

<script setup>
import { ref, watch } from "vue";


const props = defineProps({
  record: {
    type: [Object,],
    required: true
  },
  cellkey: {
    type: [String, Number],
    required: true
  },
  cellvalue: {
    type: String,
    required: true
  }
});

const inputElement = ref();
const inputValue = ref(props.cellvalue); 
const showInput = ref(false);

watch(() => props.cellvalue, (newValue) => {
    inputValue.value = newValue
});

const emit = defineEmits(['changed'])

function handleClick()
{
 showInput.value = true
 setTimeout(()=>{
     (inputElement.value).focus()
 }, 200)
}

function handleBlur()
{    
    showInput.value = false;
    inputValue.value = props.cellvalue;
}

function handleEnter()
{
    showInput.value = false
    emit('changed', {
      record: props.record, 
      key: props.cellkey, 
      value: inputValue.value
    })
}
</script>

<style>
.editable:hover span {
  display: inline-block;
}
</style>
