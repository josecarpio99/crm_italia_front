<template>
  <Page 
    :title="page.title" 
    :showFooter="page.showFooter"
    :is-loading="page.isLoading"
  >
    <Panel>

      <div class="mb-6 pb-4 border-b-2">
        <h4 class="textl-lg font-semibold">Filtros</h4>

        <div class="flex flex-col gap-4 max-w-lg sm:flex-row">

          <Dropdown  
            v-if="authStore.isMasterOrDirector()"
            class="w-full max-w-[16rem]"
            :label="trans('users.labels.branch')"
            name="branch" 
            :options="branches" 
            @input="handleBranchSelect"   
            v-model="branchSelected"            
          /> 

          <Dropdown  
            class="w-full max-w-[16rem]"
            :label="trans('global.labels.adviser_in_charge')"
            selectLabel="name"
            name="owner" 
            :options="users" 
            @input="handleOwnerSelect"   
            v-model="ownerSelected"
          />         

        </div>
      </div>

      <div v-if="! isLoading">
        <div class="flex flex-col md:flex-row gap-4 justify-center items-center text-gray-500 mb-8">

          <div>            
            <h4 class="text-center text-gray-600 font-bold mb-4">Prospección - Cartera</h4>
            <div class="flex gap-4">
              <div class="font-semibold">Total: <span><ValueField :value="sourceData?.prospeccion?.sum" /></span></div>
              <div class="font-semibold">Cantidad: <span class="text-lg font-bold text-gray-600">{{sourceData?.prospeccion?.count }}</span></div>
            </div>
          </div>

          <div>            
            <h4 class="text-center text-gray-600 font-bold mb-4">Publicidad - Guardia</h4>
            <div class="flex gap-4">
              <div class="font-semibold">Total: <span><ValueField :value="sourceData?.publicidad?.sum" /></span></div>
              <div class="font-semibold">Cantidad: <span class="text-lg font-bold text-gray-600">{{sourceData?.publicidad?.count }}</span></div>
            </div>
          </div>

        </div>

        <div class="flex flex-col lg:flex-row gap-4">
  
          <div class="w-full">
            <Bar
              id="my-chart-id"
              :options="barChart.chartOptions"
              :data="barChart.chartData"
            />
          </div>
  
          <div class="w-full">
            <Pie
              id="my-chart-id"
              :options="pieChart.chartOptions"
              :data="pieChart.chartData"
            />
          </div>        
  
        </div>

      </div>


    </Panel>
  </Page>
</template>

<script setup>
import {watch, onMounted, reactive, ref } from 'vue';
import {trans} from "@/helpers/i18n";
import Page from "@/views/layouts/Page";
import Panel from "@/views/components/Panel";
import DealService from "@/services/DealService";
import {getResponseError, prepareQuery} from "@/helpers/api";
import {useUsersStore} from "@/stores/users";
import {useAuthStore} from "@/stores/auth";
import {useAlertStore} from "@/stores";
import Dropdown from "@/views/components/input/Dropdown";
import ValueField from "@/views/components/ValueField";
import { branches } from "@/stub/statuses";
import { Bar, Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale } from 'chart.js'


const dealService = new DealService();
const alertStore = useAlertStore();
const usersStore = useUsersStore();
const authStore = useAuthStore();

const isLoading = ref(true);
const ownerSelected = ref(null);
const branchSelected = ref(null);
const users = usersStore.userList;

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, ArcElement, LinearScale)

const mainQuery = reactive({
  page: 1,
  limit: 'all',
  search: '',
  sort: '',
  filters: {
      type: {
          value: '',
          comparison: '='
      },    
      name: {
          value: '',
          comparison: '='
      },    
      source: {
          value: '',
          comparison: '='
      },
      branch: {
          value: '',
          comparison: '='
      },
      owner: {
          value: '',
          comparison: '='
      },
      value: {
          value: '',
          comparison: '='
      },
      created_at: {
          value: '',
          comparison: '='
      }
  }
});

const page = reactive({
  id: 'origins_page',
  title: trans('global.pages.origins'),
  toggleFilters: false,
  showFooter: false,
  isLoading: false
});

const barChart = reactive({
  chartData: {
    labels: [ ''],
    datasets: [ { data: [] } ]
  },
  chartOptions: {
    responsive: true
  }
});

const pieChart = reactive({
  chartData: {
    labels: ['Prospección - Cartera', 'Publicidad - Guardia'],
    datasets: [ { data: [] } ]
  },
  chartOptions: {
    responsive: true
  }
});

const sourceData = ref(null);

function fetchPage(params) {
  isLoading.value = true;
  let query = prepareQuery(params);
  dealService
      .index(query)
      .then((response) => {
          sourceData.value = response.data.meta.source;
          barChart.chartData.datasets = [
            {
              label: 'Prospección - Cartera',
              data: [
                response.data.meta.source.prospeccion.sum
              ],
              backgroundColor: '#86EFAC'
            },
            {
              label: 'Publicidad - Guardia',
              data: [
                response.data.meta.source.publicidad.sum
              ],
              backgroundColor: '#FDE047'

            }
          ]

          pieChart.chartData.datasets = [
            {
              data: [
                response.data.meta.source.prospeccion.count,
                response.data.meta.source.publicidad.count,
              ],
              backgroundColor: ['#86EFAC', '#FDE047']
            },          
          ]
          isLoading.value = false;
      })
      .catch((error) => {
          alertStore.error(getResponseError(error));
          isLoading = false;
      });
}

function handleOwnerSelect(item) {
  mainQuery.filters.owner.value = ownerSelected.value?.id || null;
}

function handleBranchSelect(item) {
  mainQuery.filters.branch.value = branchSelected.value?.id || null;
}


watch(mainQuery, (newTableState) => {  
  fetchPage(mainQuery);
});

onMounted(async () => { 
  fetchPage(mainQuery);
})

</script>