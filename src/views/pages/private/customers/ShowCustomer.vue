<template>
  <Page :title="page.title" :breadcrumbs="page.breadcrumbs" :pagePadding="false" :is-loading="page.loading">  
    <Panel v-if="customer" :borderRounded="false" :bodyPadding="false" >
      <div class="flex w-full max-h-[70vh]">
        <div class="basis-full border-r-2 overflow-auto pt-4 pr-4 pl-10">
          <div v-if="customer.owner" class="mb-6">
            <h4 class="font-semibold">{{ trans('customers.labels.owner') }}</h4>
            <span>{{ customer.owner.name }}</span>
          </div>
          <div v-if="customer.customer_status" class="mb-6">
            <h4 class="font-semibold">{{ trans('customers.labels.customer_status') }}</h4>
            <span>{{ customer.customer_status }}</span>
          </div>
          <div v-if="customer.potential_customer_status" class="mb-6">
            <h4 class="font-semibold">{{ trans('customers.labels.potential_customer_status') }}</h4>
            <span>{{ customer.potential_customer_status }}</span>
          </div>
          <div v-if="customer.mobile" class="mb-6">
            <h4 class="font-semibold">{{ trans('customers.labels.mobile') }}</h4>
            <span>{{ customer.mobile }}</span>
          </div>
          <div v-if="customer.email" class="mb-6">
            <h4 class="font-semibold">{{ trans('customers.labels.email') }}</h4>
            <span>{{ customer.email }}</span>
          </div>
          <div v-if="customer.created_at" class="mb-6">
            <h4 class="font-semibold">{{ trans('customers.labels.created_at') }}</h4>
            <span>{{ $date(customer.created_at).format() }}</span>
          </div>
          <div v-if="customer.origin" class="mb-6">
            <h4 class="font-semibold">{{ trans('customers.labels.origin') }}</h4>
            <span>{{ customer.origin }}</span>
          </div>
        </div>
        <div class="basis-[120%] border-r-2 overflow-auto pt-2 px-4">
          <Note @submit="onNoteSubmit" />
        </div>
        <div class="basis-9/12 overflow-auto pt-2 px-4">
          <Task />
        </div>
      </div>
    </Panel>
  </Page>
</template>

<script setup>
import {reactive, onBeforeMount, onMounted} from "vue";
import {useRoute} from "vue-router";
import toast from '@/helpers/toast';
import {trans} from "@/helpers/i18n";
import {toUrl} from "@/helpers/routing";
import $date from "@/helpers/date";
import CustomerService from "@/services/CustomerService";
import NoteService from "@/services/NoteService";
import {useAuthStore} from "@/stores/auth";
import Panel from "@/views/components/Panel";
import Note from "@/views/components/Note";
import Task from "@/views/components/task/Task";
import Page from "@/views/layouts/Page";

const authStore = useAuthStore();
const customerService = new CustomerService();
const noteService = new NoteService();
const route = useRoute();
let customer = null;

const page = reactive({
    id: 'show_customer',
    title: null,
    filters: false,
    breadcrumbs: [
        {
            name: trans('global.pages.customers'),
            to: toUrl('/customers/list'),

        },
        {
            name: trans('global.pages.customer'),
            active: true,
        }
    ], 
    loading: true
});

function onNoteSubmit({content}) {
  if(!content) {
    toast.error(trans('global.phrases.empty_value'));
    return;
  }

  noteService.store({
    note_type: 'customer',
    id: customer.id,
    user_id: authStore.user.id,
    content,
  }).then(res => {
    if (res.status == 200 || res.status == 201) {
      toast.success();      
    }
  });
}

onBeforeMount(() => {
  customerService.find(route.params.id).then((response) => {
    customer = response.data.data;
    page.title = customer.name;
    page.loading = false;
    console.log($date().format());
  });
});
</script>

<style lang="scss" scoped>

</style>