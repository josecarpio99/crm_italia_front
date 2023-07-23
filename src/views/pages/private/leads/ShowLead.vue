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
    <Panel v-if="lead" :borderRounded="false" :bodyPadding="false" >
      <div class="flex w-full max-h-[70vh]">
        <div class="basis-full border-r-2 overflow-auto pt-4 pr-4 pl-10">
          <div v-if="lead.owner" class="mb-6">
            <h4 class="font-semibold">{{ trans('leads.labels.owner') }}</h4>
            <div class="flex w-fit items-center bg-gray-100 p-2 pl-0 rounded-2xl">
              <CircleAvatarIcon class="w-8 h-8" :avatarUrl="lead.owner?.avatar_url" />            
              <span>{{ lead.owner.name }}</span>
            </div>
          </div>
        
          <div v-if="lead.mobile" class="mb-6">
            <h4 class="font-semibold">{{ trans('leads.labels.mobile') }}</h4>
            <div class="flex items-center">
              <Icon 
                class="mr-2 align-middle text-gray-500" 
                :name="'phone'" 
              />
              <span>{{ lead.mobile }}</span>
            </div>
          </div>
          <div v-if="lead.email" class="mb-6">
            <h4 class="font-semibold">{{ trans('leads.labels.email') }}</h4>
            <div class="flex items-center">
              <Icon 
                class="mr-2 align-middle text-gray-500" 
                :name="'envelope-o'" 
              />
              <span>{{ lead.email }}</span>
            </div>
          </div>
          <div v-if="lead.sector" class="mb-6">
            <h4 class="font-semibold">{{ trans('leads.labels.sector') }}</h4>
            <span>{{ lead.sector.name }}</span>
          </div>
          <div v-if="lead.source" class="mb-6">
            <h4 class="font-semibold">{{ trans('leads.labels.source') }}</h4>
            <span>{{ lead.source.name }}</span>
          </div>
          <div v-if="lead.created_at" class="mb-6">
            <h4 class="font-semibold">{{ trans('leads.labels.created_at') }}</h4>
            <div class="flex items-center">
              <Icon 
                class="mr-2 align-middle text-gray-500" 
                :name="'globe-w'" 
              />
              <span>{{ $date(lead.created_at).format() }}</span>
            </div>
          </div>
          <div v-if="lead.category" class="mb-6">
            <h4 class="font-semibold">{{ trans('leads.labels.category') }}</h4>
            <span>{{ lead.category.name }}</span>
          </div>
          <div v-if="lead.requirement" class="mb-6">
            <h4 class="font-semibold">{{ trans('leads.labels.requirement') }}</h4>
            <span>{{ lead.requirement }}</span>
          </div>
          
        </div>
        <div class="basis-[120%] border-r-2 overflow-auto pt-2 px-4">
          <Note @submit="onNoteSubmit" />
          <ListFeed />
        </div>
        <div class="basis-9/12 overflow-auto pt-2 px-4">
          <Task @submit="onTaskSubmit" />
          <Document @submit="onDocumentSubmit" />
        </div>
      </div>
    </Panel>

  </Page>

  <EditLeadModal v-if="lead" :show-delete="true" :modalActive="showEditLeadModal" :lead="lead" @updated="onModalUpdate" @close-modal="toggleModal" @delete="onModalDelete" />

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
import LeadService from "@/services/LeadService";
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
import Task from "@/views/components/task/Task";
import ListFeed from "@/views/components/ListFeed";
import Page from "@/views/layouts/Page";
import EditLeadModal from "@/views/pages/private/leads/modals/EditLeadModal.vue";
import Icon from "@/views/components/icons/Icon";
import CircleAvatarIcon from "@/views/components/icons/CircleAvatar";

const authStore = useAuthStore();
const alertStore = useAlertStore();
const taskStore = useTaskStore();
const noteStore = useNoteStore();
const feedStore = useFeedStore();
const documentStore = useDocumentStore();

const leadService = new LeadService();
const noteService = new NoteService();
const taskService = new TaskService();
const documentService = new DocumentService();

const route = useRoute();
const showEditLeadModal = ref(false);
let lead = null;

const page = reactive({
    id: 'show_lead',
    title: null,    
    filters: false,
    breadcrumbs: [
        {
            name: trans('global.pages.leads'),
            to: toUrl('/leads/list'),

        },
        {
            name: trans('global.pages.lead'),
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
    note_type: 'lead',
    id: lead.id,
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
    task_type: 'lead',
    id: lead.id,
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
  formData.append("model_type", 'lead');
  formData.append("model_id", lead.id);
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
  showEditLeadModal.value = !showEditLeadModal.value;   

  if (
    showEditLeadModal.value == true
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
    leadService.delete(lead.id).then(function (response) {
      toast.success(trans('global.phrases.delete_success'));
      router.push({name: 'leads.list'});
    });
  });
}

async function fetchRecord() {
  page.loading = true;
  leadService.find(route.params.id).then((response) => {
    lead = response.data.data;
    taskStore.tasks = lead.tasks;
    noteStore.notes = lead.notes;
    documentStore.documents = lead.media;
    page.title = lead.name;
    if (lead.is_company) {
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