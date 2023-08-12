<template>
  <Page 
    :title="page.title" 
    :titleIcon="page.titleIcon" 
    :breadcrumbs="page.breadcrumbs" 
    :pagePadding="false" 
    :is-loading="page.loading"
    @action="onPageAction"
  >  
    <template #beside-title>
      <div class="flex items-center ml-6" v-if="deal">
        <slot v-for="(action, j) in page.actions" :name="'page-actions-'+action.id">
            <Button v-if="action.hasOwnProperty('to') && action.to" :class="{'mr-3' : j < (page.actions.length-1)}" class="py-[.375rem]" :to="action.to" :title="action.name" :icon="action.hasOwnProperty('icon') ? action.icon : null" :theme="action.hasOwnProperty('theme') ? action.theme : null" :label="action.name"/>
            <Button v-else @click="onPageAction({action: action})" :class="{'mr-3' : j < (page.actions.length-1)}" class="py-[.375rem]" :title="action.name" :icon="action.hasOwnProperty('icon') ? action.icon : null" :theme="action.hasOwnProperty('theme') ? action.theme : null" :label="action.name"/>
        </slot>
      </div>
    </template>

    <Panel v-if="deal" :borderRounded="false" :bodyPadding="false" >
      <div class="flex w-full max-h-[70vh]">
        <div class="basis-full border-r-2 overflow-auto pt-4 pr-4 pl-10">         

          <div v-if="deal.category" class="mb-6">
            <h4 class="font-semibold">{{ trans('deals.labels.category') }}</h4>
            <span>{{ deal.category.name }}</span>
          </div>        
        
          <div v-if="deal.source" class="mb-6">
            <h4 class="font-semibold">{{ trans('deals.labels.source') }}</h4>
            <span>{{ deal.source.name }}</span>
          </div>     
          
          <div v-if="deal.owner" class="mb-6">
            <h4 class="font-semibold">{{ trans('deals.labels.owner') }}</h4>
            <div class="flex w-fit items-center bg-gray-100 p-2 pl-0 rounded-2xl">
              <CircleAvatarIcon class="w-8 h-8" :avatarUrl="deal.owner?.avatar_url" />            
              <span>{{ deal.owner.name }}</span>
            </div>
          </div>

          <div v-if="deal.value" class="mb-6">
            <h4 class="font-semibold">{{ trans('deals.labels.value') }}</h4>
            <span class="text-2xl text-gray-600 font-semibold">MXN{{ deal.value.toLocaleString('en-US') }}</span>
          </div>        

          <div v-if="deal.win_probability" class="mb-6">
            <h4 class="font-semibold">{{ trans('deals.labels.win_probability') }}</h4>
            <span>{{ deal.win_probability + '%' }}</span>
          </div>      

          <div v-if="deal.estimated_close_date_range" class="mb-6">
            <h4 class="font-semibold">{{ trans('deals.labels.estimated_close_date') }}</h4>
            <span>{{ deal.estimated_close_date_range }}</span>
          </div>

          <div v-if="deal.created_at" class="mb-6">
            <h4 class="font-semibold">{{ trans('deals.labels.created_at') }}</h4>
            <div class="flex items-center">
              <Icon 
                class="mr-2 align-middle text-gray-500" 
                :name="'globe-w'" 
              />
              <span>{{ $date(deal.created_at).format() }}</span>
            </div>
          </div>                         
          
        </div>
        <div class="basis-[120%] border-r-2 overflow-auto pt-2 px-4">
          <Note @submit="onNoteSubmit" />
          <ListFeed />
        </div>
        <div class="basis-9/12 overflow-auto pt-2 px-4">
          <AssociatedContact :customer="deal.customer" />
          <Task @submit="onTaskSubmit" />
          <Document @submit="onDocumentSubmit" />
        </div>
      </div>
    </Panel>

  </Page>

  <EditCotizadoModal v-if="deal" :show-delete="true" :modalActive="showEditDealModal" :deal="deal" @updated="onModalUpdate" @close-modal="toggleModal" @delete="onModalDelete" />

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
import DealService from "@/services/DealService";
import NoteService from "@/services/NoteService";
import TaskService from "@/services/TaskService";
import DocumentService from "@/services/DocumentService";
import {useAuthStore} from "@/stores/auth";
import {useAlertStore} from "@/stores";
import {useTaskStore} from "@/stores/tasks";
import {useNoteStore} from "@/stores/notes";
import {useFeedStore} from "@/stores/feed";
import {useDocumentStore} from "@/stores/document";
import Panel from "@/views/components/Panel";
import Note from "@/views/components/Note";
import Document from "@/views/components/Document";
import AssociatedContact from "@/views/components/AssociatedContact";
import Task from "@/views/components/task/Task";
import ListFeed from "@/views/components/ListFeed";
import Page from "@/views/layouts/Page";
import EditCotizadoModal from "@/views/pages/private/deals/modals/EditCotizadoModal.vue";
import Icon from "@/views/components/icons/Icon";
import CircleAvatarIcon from "@/views/components/icons/CircleAvatar";
import Button from "@/views/components/input/Button";

const authStore = useAuthStore();
const alertStore = useAlertStore();
const taskStore = useTaskStore();
const noteStore = useNoteStore();
const feedStore = useFeedStore();
const documentStore = useDocumentStore();

const dealService = new DealService();
const noteService = new NoteService();
const taskService = new TaskService();
const documentService = new DocumentService();

const route = useRoute();
const showEditDealModal = ref(false);
let deal = null;

const page = reactive({
    id: 'show_deal',
    title: null,    
    filters: false,
    breadcrumbs: [
        {
            name: trans('global.pages.cotizados'),
            to: toUrl('/deals/oportunidades/list'),

        },
        {
            name: trans('global.pages.cotizado'),
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
    note_type: 'deal',
    id: deal.id,
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
    task_type: 'deal',
    id: deal.id,
    user_id: authStore.user.id
  }).then(res => {
    if (res.status == 200 || res.status == 201) {
      toast.success();  
      fetchRecord();
    }
  });
}

function onDocumentSubmit({file}) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("model_type", 'deal');
  formData.append("model_id", deal.id);
  documentService.store(formData, {'Content-type': 'multipart/form-data'}
  ).then(res => {
    if (res.status == 200 || res.status == 201 || res.status == 204) {
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
  showEditDealModal.value = !showEditDealModal.value;   

  if (
    showEditDealModal.value == true
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
    dealService.delete(deal.id).then(function (response) {
      toast.success(trans('global.phrases.delete_success'));
      router.push({name: 'deals.list'});
    });
  });
}

async function fetchRecord() {
  page.loading = true;
  dealService.find(route.params.id).then((response) => {
    deal = response.data.data;
    taskStore.tasks = deal.tasks;
    noteStore.notes = deal.notes;
    documentStore.documents = deal.media;
    page.title = deal.name;
    if (deal.type == 'cotizado') {
      page.breadcrumbs[0].to = toUrl('/deals/cotizados/list')
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