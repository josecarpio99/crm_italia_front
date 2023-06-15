<template>
  <div class="rounded-md border-2 mt-2">
    <div 
      class="flex items-center border-b-[1px] py-2 pl-4 pr-6 cursor-pointer hover:bg-gray-100"
      @click="isOpen = !isOpen"
    >
      <Icon name="check-square-o" class="basis-1/12 text-gray-500 cursor-pointer" />
      <div class="basis-full">
        <h5 class="font-semibold">{{ trans('global.labels.active_tasks') }}</h5>
        <p class="text-xs text-gray-500 mt-1">{{ trans('global.labels.without_active_tasks') }}</p>
      </div>
      <div class="text-right basis-2/12 flex justify-between items-center">
        <div>
          <Icon 
            name="plus" 
            class="text-gray-500 cursor-pointer hover:text-blue-300" 
            @click.stop="showDropdown = !showDropdown"
          />

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
              <template #popper>    
                <Form id="create-task" @submit.prevent="onSubmit" class="w-96 p-6">
                  <TextInput class="mb-4" type="text" :required="true" name="content" v-model="form.content" :label="trans('tasks.labels.name')"/>
                  <TextInput class="mb-4" type="datetime-local" :required="true" name="due_at" v-model="form.due_at" :label="trans('tasks.labels.due_at')"/>

                  <Dropdown  
                    class="mb-8"
                    :required="true"
                    :label="trans('tasks.labels.owner')"
                    selectLabel="name"
                    name="owner" 
                    :options="usersStore.userList" 
                    v-model="form.owner_id"              
                  /> 

                  <div class="text-right">
                    <Button
                      theme="info"
                      :label="trans('tasks.buttons.add')"
                    />
                  </div>
                </Form>
              </template>
          </VDropdown> 
        </div>
        <Icon :name="isOpen ? 'angle-up' : 'angle-down'" class="text-gray-500" />        
      </div>
    </div>

    <div v-if="isOpen" class="flex items-center justify-center p-2">
      <p class="text-gray-500 my-4">{{ trans('global.labels.without_tasks') }}</p>
    </div>
  </div>
    
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue';
import {trans} from '@/helpers/i18n';
import {useUsersStore} from "@/stores/users";
import {useAuthStore} from "@/stores/auth";
import Icon from "@/views/components/icons/Icon";
import Form from "@/views/components/Form";
import TextInput from "@/views/components/input/TextInput";
import Dropdown from "@/views/components/input/Dropdown";
import Button from "@/views/components/input/Button";

const isOpen = ref(true);
const showDropdown = ref(false);
const form = reactive({
  content: '',           
  due_at: '',
  owner_id: '',
});

const authStore = useAuthStore();
const usersStore = useUsersStore();

function onSubmit() {
  console.log(form);
}

onMounted(() => {
  form.owner_id = {
    id: authStore.user.id,
    name: authStore.user.name
  };
});

</script>

<style lang="scss" scoped>

</style>