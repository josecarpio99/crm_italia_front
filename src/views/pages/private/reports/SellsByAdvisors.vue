<template>
  <Page :title="trans('global.menu.sells_by_advisors')">       
    <iframe 
        class="w-full min-h-[85vh] mt-4" 
        :src="'https://app.powerbi.com/view?r=eyJrIjoiZDdjZWFmNTQtYWFmNS00NzE2LWJkMjAtZDgyNGEyYmE3NTM3IiwidCI6IjRjNjlkODFmLWU4YzEtNGFiMy04OTcxLTg5M2RhNjdkMjE4OSIsImMiOjR9'" 
        title="Venta por asesores">
    </iframe>
  </Page>
</template>

<script setup>
import Page from "@/views/layouts/Page";
import {trans} from "@/helpers/i18n";

</script>