<template>
  <Page :title="page.title">
    <Panel>
      <div class="max-w-[800px] mx-auto">
        <Accordion :title="'Lorem ipsum dolor sit amet'">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore obcaecati autem esse ea cumque commodi ab vitae accusamus voluptatum exercitationem vero officiis dolore, sed consectetur aliquid aspernatur, delectus nisi ipsum.
        </Accordion>
        <Accordion :title="'Lorem ipsum dolor sit amet'">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore obcaecati autem esse ea cumque commodi ab vitae accusamus voluptatum exercitationem vero officiis dolore, sed consectetur aliquid aspernatur, delectus nisi ipsum.
        </Accordion>
        <Accordion :title="'Lorem ipsum dolor sit amet'">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore obcaecati autem esse ea cumque commodi ab vitae accusamus voluptatum exercitationem vero officiis dolore, sed consectetur aliquid aspernatur, delectus nisi ipsum.
        </Accordion>
      </div>
    </Panel>
  </Page>
</template>

<script setup>
import {reactive} from "vue";
import Page from "@/views/layouts/Page";
import Panel from "@/views/components/Panel";
import Accordion from "@/views/components/Accordion";
import {trans} from "@/helpers/i18n";

const page = reactive({
  id: 'faq',
  title: trans('global.pages.faq'),
  filters: false    
});
</script>