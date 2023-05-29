<template>
    <Page :title="page.title" :breadcrumbs="page.breadcrumbs" :actions="page.actions" @action="onPageAction">      
        <template #default>
            <Table :id="page.id" v-if="table" :headers="table.headers" :columns="table.columns" :sorting="table.sorting" :actions="table.actions" :records="table.records" :editableFields="table.editableFields" :pagination="table.pagination" :is-loading="table.loading" @page-changed="onTablePageChange" @action="onTableAction" @sort="onTableSort">
              
                <template v-slot:cell-name="{ item }">
                    <TableCell 
                        :cellvalue="item.name"
                        :record="item" 
                        cellkey="name" 
                        @changed="handleCellChange"
                    >                        
                        {{ item.name }}
                    </TableCell>                   
                </template>    

                <template v-slot:cell-email="{ item }">
                    <TableCell 
                        :cellvalue="item.email"
                        :record="item" 
                        cellkey="email" 
                        @changed="handleCellChange"
                    >                        
                        {{ item.email }}
                    </TableCell>                   
                </template>    

                <template v-slot:cell-role="{ item }">
                    <TableCell 
                        :cellvalue="roleOptions.find(option => option.id === item.role)"
                        :record="item" 
                        :options="roleOptions"
                        type="list"
                        cellkey="role" 
                        @changed="handleCellChange"
                    >                        
                        {{ item.role }}
                    </TableCell>                   
                </template>    
            </Table>
        </template>
    </Page>
</template>

<script setup>

import {trans} from "@/helpers/i18n";
import UserService from "@/services/UserService";
import {watch, onMounted, defineComponent, reactive, ref, defineAsyncComponent } from 'vue';
import {getResponseError, prepareQuery} from "@/helpers/api";
import {toUrl} from "@/helpers/routing";
import {useAlertStore} from "@/stores";
import alertHelpers from "@/helpers/alert";
import Page from "@/views/layouts/Page";
import Table from "@/views/components/Table";
import TableCell from "@/views/components/table/TableCell";
import Avatar from "@/views/components/icons/Avatar";
import Filters from "@/views/components/filters/Filters";
import FiltersRow from "@/views/components/filters/FiltersRow";
import FiltersCol from "@/views/components/filters/FiltersCol";
import TextInput from "@/views/components/input/TextInput";
import Dropdown from "@/views/components/input/Dropdown";
import {roleOptions} from "@/stub/roles";

const service = new UserService();
const alertStore = useAlertStore();

const mainQuery = reactive({
    page: 1,
    search: '',
    sort: '',
    filters: {
        search: {
            value: '',
            comparison: '='
        },              
        role: {
            value: '',
            comparison: '='
        }
    }
});

const page = reactive({
    id: 'list_users',
    title: trans('global.pages.users'),
    breadcrumbs: [
        {
            name: trans('global.pages.users'),
            to: toUrl('/users'),
            active: true,
        }
    ],  
    toggleFilters: false,
});

const table = reactive({
    headers: {
        name: trans('users.labels.name'),
        email: trans('users.labels.email'),
        role: trans('users.labels.role'),
    },
    sorting: {
        name: true,
        email: true
    },
    columns: [
        {
            key: 'name',
            label: trans('users.labels.name'),
            editable: true,
            sorteable: true
        },
        {
            key: 'email',
            label: trans('users.labels.email'),
            sorteable: true
        },
        {
            key: 'role',
            label: trans('users.labels.role'),
            sortable: false,
        },
        
    ],           
    pagination: {
        meta: null,
        links: null,
    },
    actions: {
        edit: {
            id: 'edit',
            name: trans('global.actions.edit'),
            icon: "fa fa-edit",
            showName: false,
            to: toUrl('/users/{id}/edit')
        },
        delete: {
            id: 'delete',
            name: trans('global.actions.delete'),
            icon: "fa fa-trash",
            showName: false,
            danger: true,
        }
    },
    loading: false,
    records: null,
    editableFields: {
        name: {
            type: 'input'
        }
    }
})  

function onTableSort(params) {
    mainQuery.sort = params;
}

function onTablePageChange(page) {
    mainQuery.page = page;
}

function onTableAction(params) {
    switch (params.action.id) {
        case 'delete':
            alertHelpers.confirmDanger(function () {
                service.delete(params.item.id).then(function (response) {
                    fetchPage(mainQuery);
                });
            })
            break;
    }
}

function onPageAction(params) {           
    switch (params.action.id) {
        case 'filters':
            page.toggleFilters = !page.toggleFilters;
            break;
    }
}

function onFiltersClear() {
    let clonedFilters = mainQuery.filters;
    for(let key in clonedFilters) {
        clonedFilters[key].value = '';
    }
    mainQuery.filters = clonedFilters;
}

function fetchPage(params) {
    table.records = [];
    table.loading = true;
    let query = prepareQuery(params);
    service
        .index(query)
        .then((response) => {
            table.records = response.data.data;
            table.pagination.meta = response.data.meta;
            table.pagination.links = response.data.links;
            table.loading = false;
        })
        .catch((error) => {
            alertStore.error(getResponseError(error));
            table.loading = false;
        });
}

function handleCellChange(payload) {
    const record = table.records.find((item) => item.id == payload.record.id);          
    record[payload.key] = typeof payload.value == 'object' ? payload.value.id : payload.value.toString();                   
    service.handleUpdate(page.id, record.id, record);
}

watch(mainQuery, (newTableState) => {
    fetchPage(mainQuery);
});

onMounted(() => {
    fetchPage(mainQuery);
});

</script>
