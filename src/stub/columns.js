import {trans} from "@/helpers/i18n";
import {customerCategories} from "@/stub/categories";
import { datesFilter } from "@/stub/date";
import { customerStatuses } from "@/stub/statuses";
import { leadStatuses } from "@/stub/statuses";

export const customerColumns = [
  {
      key: 'name',
      label: trans('global.labels.name'),
      show: true,
      locked: true,
      editable: true,
      sorteable: true,
      filterable: true,
      filter: {
        modelValue: '',
        type: 'input'            
      }
  },
  {
      key: 'email',
      label: trans('global.labels.email'),
      show: true,
      locked: true,
      sorteable: true,
      editable: true
  },    
  {
      key: 'mobile',
      label: trans('customers.header.phone'),
      show: true,
      locked: false,
      sorteable: false,
      editable: true
  },    
  {
      key: 'category',
      label: trans('customers.labels.category'),
      show: true,
      locked: false,
      sorteable: false,
      filterable: true,
      editable: true,
      filter: {
        modelValue: '',
        type: 'select',
        options: customerCategories
      },
      edit: {
        type: 'list',
        options: customerCategories
      },
      cellKey: 'category.id',
      cellLabel: 'category.name'
  },    
  {
      key: 'owner',
      label: trans('global.labels.owner'),
      show: true,
      locked: false,
      sorteable: false,
      filterable: true,
      editable: true,
      filter: {
        modelValue: '',
        type: 'multiselect',
        options: [],
        optionsLabel: 'name'
      },
      edit: {
        type: 'list',
        options: [],
        optionsLabel: 'name'
      },
      cellKey: 'owner.id',
      cellLabel: 'owner.name'
  },    
  {
      key: 'status',
      cellLabel: 'customer_status',
      label: trans('customers.labels.customer_status'),
      show: true,
      locked: false,
      sorteable: false,
      filterable: true,
      editable: true,
      filter: {
        modelValue:'',
        type: 'select',
        options: customerStatuses,
        type: 'multiselect'
      },
      edit: {
        type: 'list',
        options: customerStatuses
      }
  },    
  {
      key: 'created_at',
      label: trans('customers.labels.created_at'),
      show: true,
      locked: false,
      sorteable: true,
      filterable: true,
      editable: false,
      filter: {
        modelValue:'',
        type: 'select',
        options: datesFilter
      }          
  },
]

export const leadColumns = [  
  {
    key: 'lead',
    label: trans('global.pages.lead'),
    show: true,
      locked: true,
  },         
  {
      key: 'name',
      label: trans('global.labels.name'),
      show: true,
      locked: true,
      editable: true,
      sorteable: true,
      filterable: true,
      filter: {
        modelValue: '',
        type: 'input'            
      }
  },         
  {
      key: 'owner',
      label: trans('global.labels.owner'),
      show: true,
      locked: false,
      sorteable: false,
      filterable: true,
      editable: true,
      filter: {
        modelValue: '',
        type: 'multiselect',
        options: [],
        optionsLabel: 'name'
      },
      edit: {
        type: 'list',
        options: [],
        optionsLabel: 'name'
      },
      cellKey: 'owner.id',
      cellLabel: 'owner.name'
  },    
  {
      key: 'status',
      label: trans('global.labels.status'),
      show: true,
      locked: false,
      sorteable: false,
      filterable: true,
      editable: true,
      filter: {
        modelValue:'',
        type: 'multiselect',
        options: leadStatuses
      },
      edit: {
        type: 'list',
        options: leadStatuses
      }
  },
  {
      key: 'source',
      label: trans('global.labels.source'),
      show: true,
      locked: false,
      sorteable: false,
      filterable: true,
      editable: true,
      filter: {
        modelValue: '',
        type: 'multiselect',
        options: [],
        optionsLabel: 'name'
      },
      edit: {
        type: 'list',
        options: [],
        optionsLabel: 'name'
      },
      cellKey: 'source.id',
      cellLabel: 'source.name'
  },
  {
      key: 'created_at',
      label: trans('global.labels.created_at'),
      show: true,
      locked: false,
      sorteable: true,
      filterable: true,
      editable: false,
      filter: {
        modelValue:'',
        type: 'select',
        options: datesFilter
      }          
  },
]

export const dealColumns = [
  {
      key: 'deal',
      label: trans('global.pages.deal'),
      show: true,
      locked: true,
  },   
  {
      key: 'name',
      label: trans('global.labels.name'),
      show: true,
      locked: true,
      editable: true,
      sorteable: true,
      filterable: true,
      filter: {
        modelValue: '',
        type: 'input'            
      }
  },         
  {
      key: 'value',
      label: trans('global.labels.value'),
      show: true,
      locked: false,
      editable: true,
      sorteable: false,
      filterable: true,
      filter: {
        modelValue: {
          minValue: null,
          maxValue: null
        },
        type: 'range'
      },       
  },         
  {
      key: 'source',
      label: trans('global.labels.source'),
      show: true,
      locked: false,
      sorteable: false,
      filterable: true,
      editable: true,
      filter: {
        modelValue: '',
        type: 'multiselect',
        options: [],
        optionsLabel: 'name'
      },
      edit: {
        type: 'list',
        options: [],
        optionsLabel: 'name'
      },
      cellKey: 'source.id',
      cellLabel: 'source.name'
  },       
  {
      key: 'owner',
      label: trans('global.labels.owner'),
      show: true,
      locked: false,
      sorteable: false,
      filterable: true,
      editable: true,
      filter: {
        modelValue: '',
        type: 'multiselect',
        options: [],
        optionsLabel: 'name'
      },
      edit: {
        type: 'list',
        options: [],
        optionsLabel: 'name'
      },
      cellKey: 'owner.id',
      cellLabel: 'owner.name'
  },
  {
      key: 'created_at',
      label: trans('global.labels.created_at'),
      show: true,
      locked: false,
      editable: false,
      sorteable: true,
      filterable: true,
      filter: {
        modelValue:'',
        type: 'select',
        options: datesFilter
      }        
  },         
]