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
    <Panel v-if="deal" :borderRounded="false" :bodyPadding="false" >
      <div class="flex w-full max-h-[70vh]">
        <div class="basis-full border-r-2 overflow-auto pt-4 pr-4 pl-10">
          <div v-if="deal.estimated_size" class="mb-6">
            <h4 class="font-semibold">{{ trans('deals.labels.estimated_size') }}</h4>
            <span>{{ deal.estimated_size }}</span>
          </div>

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
            <span>{{ deal.owner.name }}</span>
          </div>

          <div v-if="deal.value" class="mb-6">
            <h4 class="font-semibold">{{ trans('deals.labels.value') }}</h4>
            <span>MXN{{ deal.value }}</span>
          </div>

          <div v-if="deal.stage" class="mb-6">
            <h4 class="font-semibold">{{ trans('deals.labels.stage') }}</h4>
            <span>{{ deal.stage.name }}</span>
          </div> 

          <div v-if="deal.win_probability" class="mb-6">
            <h4 class="font-semibold">{{ trans('deals.labels.win_probability') }}</h4>
            <span>{{ deal.win_probability }}</span>
          </div>

          <div v-if="deal.estimated_close_date" class="mb-6">
            <h4 class="font-semibold">{{ trans('deals.labels.estimated_close_date') }}</h4>
            <span>{{ $date(deal.estimated_close_date).format() }}</span>
          </div>

          <div v-if="deal.created_at" class="mb-6">
            <h4 class="font-semibold">{{ trans('deals.labels.created_at') }}</h4>
            <span>{{ $date(deal.created_at).format() }}</span>
          </div>  

          <div v-if="deal.stage_moved_at" class="mb-6">
            <h4 class="font-semibold">{{ trans('deals.labels.stage_moved_at') }}</h4>
            <span>{{ $date(deal.stage_moved_at).format() }}</span>
          </div>                   
          
        </div>
        <div class="basis-[120%] border-r-2 overflow-auto pt-2 px-4 hidden">
          <Note @submit="onNoteSubmit" />
        </div>
        <div class="basis-9/12 overflow-auto pt-2 px-4 hidden">
          <Task @submit="onTaskSubmit" />
        </div>
      </div>
    </Panel>

  </Page>

  <EditOportunidadModal v-if="deal" :show-delete="true" :modalActive="showEditDealModal" :deal="deal" @updated="onModalUpdate" @close-modal="toggleModal" @delete="onModalDelete" />

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
import {useAuthStore} from "@/stores/auth";
import {useAlertStore} from "@/stores";
import Panel from "@/views/components/Panel";
import Note from "@/views/components/Note";
import Task from "@/views/components/task/Task";
import Page from "@/views/layouts/Page";
import EditOportunidadModal from "@/views/pages/private/deals/modals/EditOportunidadModal.vue";

const authStore = useAuthStore();
const alertStore = useAlertStore();
const dealService = new DealService();
const noteService = new NoteService();
const taskService = new TaskService();
const route = useRoute();
const showEditDealModal = ref(false);
let deal = null;

const page = reactive({
    id: 'show_deal',
    title: null,    
    filters: false,
    breadcrumbs: [
        {
            name: trans('global.pages.deals'),
            to: toUrl('/deals/list'),

        },
        {
            name: trans('global.pages.deal'),
            active: true,
        }
    ], 
    loading: true,
    actions: [
      {
        id: 'edit',
        name: trans('global.actions.edit'),
        type: 'button',
        theme: 'outline'
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
    page.title = deal.customer.name;
    if (deal.is_company) {
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