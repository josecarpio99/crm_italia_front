<template>
  <Page 
    :title="page.title" 
    :titleIcon="page.titleIcon" 
    :breadcrumbs="page.breadcrumbs" 
    :pagePadding="false" 
    :is-loading="page.loading"
    :actions="page.actions"
    @action="onPageAction"
  >  
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
          <Task @submit="onTaskSubmit" />
        </div>
      </div>
    </Panel>

  </Page>

  <EditPersonModal v-if="customer" :show-delete="true" :modalActive="showEditPersonModal" :customer="customer" @updated="onModalUpdate" @close-modal="toggleModal" @delete="onModalDelete" />
  <EditCompanyModal v-if="customer" :show-delete="true" :modalActive="showEditCompanyModal" :customer="customer" @updated="onModalUpdate" @close-modal="toggleModal" @delete="onModalDelete" />

</template>

<script setup>
import {reactive, ref, onBeforeMount, onMounted} from "vue";
import router from "@/router";
import {useRoute} from "vue-router";
import toast from '@/helpers/toast';
import {trans} from "@/helpers/i18n";
import {toUrl} from "@/helpers/routing";
import alertHelpers from "@/helpers/alert";
import $date from "@/helpers/date";
import CustomerService from "@/services/CustomerService";
import NoteService from "@/services/NoteService";
import TaskService from "@/services/TaskService";
import {useAuthStore} from "@/stores/auth";
import {useAlertStore} from "@/stores";
import {useTaskStore} from "@/stores/tasks";
import {useNoteStore} from "@/stores/notes";
import {useFeedStore} from "@/stores/feed";
import Panel from "@/views/components/Panel";
import Note from "@/views/components/Note";
import Task from "@/views/components/task/Task";
import Page from "@/views/layouts/Page";
import EditPersonModal from "@/views/pages/private/customers/modals/EditPersonModal.vue";
import EditCompanyModal from "@/views/pages/private/customers/modals/EditCompanyModal.vue";

const authStore = useAuthStore();
const alertStore = useAlertStore();
const taskStore = useTaskStore();
const noteStore = useNoteStore();
const feedStore = useFeedStore();
const customerService = new CustomerService();
const noteService = new NoteService();
const taskService = new TaskService();
const route = useRoute();
const showEditPersonModal = ref(false);
const showEditCompanyModal = ref(false);
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
    loading: true,
    actions: [
      {
        id: 'edit',
        name: trans('global.actions.edit'),
        type: 'button'
      }
    ]
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
      fetchRecord();
    }
  });
}

function onTaskSubmit({content, due_at, owner}) { 
  taskService.store({
    content: content,
    due_at: due_at,
    owner_id: owner.id,
    task_type: 'customer',
    id: customer.id,
    user_id: authStore.user.id
  }).then(res => {
    if (res.status == 200 || res.status == 201) {
      toast.success();
      fetchRecord();
    }
  });
}

function onPageAction(data) {
  switch(data.action.id) {
    case 'edit':
      toggleModal();
      break;
  }
}

function toggleModal() {
  alertStore.clear();
  if (customer.is_company == 1) {
    showEditCompanyModal.value = !showEditCompanyModal.value;      
  } else {
    showEditPersonModal.value = !showEditPersonModal.value;
  }      

  if (
    showEditCompanyModal.value == true ||       
    showEditPersonModal.value == true
  ) {
      alertStore.showOnPage = false;
  } else {
      alertStore.showOnPage = true;
  }
}

function onModalUpdate() {
  fetchRecord();
}

function onModalDelete() {
  alertHelpers.confirmDanger(function () {
    customerService.delete(customer.id).then(function (response) {
      toast.success(trans('global.phrases.delete_success'));
      router.push({name: 'customers.list'});
    });
  });
}

async function fetchRecord() {
  page.loading = true;
  customerService.find(route.params.id).then((response) => {
    customer = response.data.data;
    taskStore.tasks = customer.tasks;
    noteStore.notes = customer.notes;
    console.log(feedStore.getFeed);
    page.title = customer.name;
    if (customer.is_company) {
      page.titleIcon = {name: 'building-o'}
    }
    page.loading = false;
  });
}

onBeforeMount(async () => {
  await fetchRecord();
});
</script>

<style lang="scss" scoped>

</style>