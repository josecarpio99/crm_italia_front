<template>
  <Page :title="page.title">
    <Panel>
      <div class="max-w-[800px] mx-auto">

        <Accordion :title="'¿Que es una &quot;oportunidad&quot;?'">
          Es cuando tienes contacto con un posible cliente el cual ya tiene una necesidad de mobiliario, pero aún no haz llegado a la fase de tener una cotizacion en firme realizada. El cliente ya debe de estar en comunicación contigo para contar como Oportunidad.
        </Accordion>

        <Accordion :title="'¿Que es una &quot;cotización&quot;?'">
          Es cuando ya tienes una cotización en firme con tu cliente. El proyecto debe de estar vivo para que siga contando como una cotización. 
        </Accordion>

        <Accordion :title="'¿Que es una &quot;clasificación de la cuenta&quot;?'">
          Es una manera de separar a los clientes según su potencial de compra recurrente a largo plazo. 
        </Accordion>

        <Accordion :title="'¿Que hago en el CRM cuando una oportunidad evoluciona y se vuelve una cotizacion?'">
          Debes convertir la oportunidad en cotización usando la opcion "convertir a cotización" ubicada en el menú superior de la página de detalles de la oportunidad. Lo que no debes de hacer es volver a subir una nueva cotización, y dejar la oportunidad vigente! 
        </Accordion>
        
      </div>



      <div class="mt-16 pt-8 border-t-2">
        <img src="\assets\images\organigrama.jpg" alt="organigrama" class="">
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