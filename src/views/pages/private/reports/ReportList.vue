<template>
  <Page
    :title="'Reportes'" 
    :showFooter="false"
  >
    <Panel>
      <div class="p-8">
        <ul class="report-list max-w-6xl mx-auto">
          <li v-if="authStore.isMasterOrDirector()">
            <router-link               
              :to="{name: 'reports.scorecard'}" 
              class="border-2 border-theme-500 p-4 text-theme-500 hover:bg-gray-100 text-center uppercase w-full font-semibold rounded-lg block tracking-wide">
              {{ trans('global.menu.scorecard') }}
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'reports.origins'}" class="border-2 border-theme-500 p-4 text-theme-500 hover:bg-gray-100 text-center uppercase w-full font-semibold rounded-lg block tracking-wide">
              {{ trans('global.menu.origins') }}
            </router-link>
          </li>
        </ul>
      </div>
    </Panel>
  </Page>
</template>

<script setup>
import Page from "@/views/layouts/Page";
import Panel from "@/views/components/Panel";
import {trans} from "@/helpers/i18n";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

</script>

<style scope>
.report-list {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(
      150px,
      400px
    )
  );
  gap: 16px;
  place-content: center;
}
</style>
