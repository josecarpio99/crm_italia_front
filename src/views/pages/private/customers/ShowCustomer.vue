<template>
  <Page :title="page.title" :breadcrumbs="page.breadcrumbs" :pagePadding="false" :is-loading="page.loading">  
    <Panel :borderRounded="false" v-if="customer" >
      <div class="flex w-full">
        <div class="basis-full pt-2 px-4">
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
            <span>{{ customer.created_at }}</span>
          </div>
          <div v-if="customer.origin" class="mb-6">
            <h4 class="font-semibold">{{ trans('customers.labels.origin') }}</h4>
            <span>{{ customer.origin }}</span>
          </div>
        </div>
        <div class="basis-[120%] pt-2 px-4"></div>
        <div class="basis-9/12 pt-2 px-4"></div>
      </div>
    </Panel>
  </Page>
</template>

<script setup>
import {reactive, onBeforeMount, onMounted} from "vue";
import {useRoute} from "vue-router";
import {trans} from "@/helpers/i18n";
import {toUrl} from "@/helpers/routing";
import CustomerService from "@/services/CustomerService";
import Panel from "@/views/components/Panel";
import Page from "@/views/layouts/Page";

const customerService = new CustomerService();
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

onBeforeMount(() => {
  customerService.find(route.params.id).then((response) => {
    customer = response.data.data;
    page.title = customer.name;
    page.loading = false;
  });
});
</script>

<style lang="scss" scoped>

</style>