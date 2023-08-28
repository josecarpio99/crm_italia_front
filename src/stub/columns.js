import {trans} from "@/helpers/i18n";
import {customerCategories} from "@/stub/categories";
import {dealCategories, leadCategories} from "@/stub/categories";
import { datesFilter } from "@/stub/date";
import { customerStatuses } from "@/stub/statuses";
import { leadStatuses, dealStages, branches, customerStarStatus } from "@/stub/statuses";

export const customerColumns = [
  {
    key: 'star',
    label: trans('customers.labels.star'),
    show: true,
    locked: false,
    editable: false,
    sorteable: false,
    filterable: true,
    filter: {
      modelValue: '',
      type: 'select',
      options: customerStarStatus
    }
  },
  {
      key: 'name',
      label: trans('customers.labels.name'),
      show: true,
      locked: true,
      editable: true,
      sorteable: true,
      filterable: true,
      filter: {
        modelValue: null,
        type: 'input'
      }
  },
  {
      key: 'company_name',
      label: trans('customers.labels.company_name'),
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
    key: 'branch',
    label: trans('users.labels.branch'),
    show: true,
    locked: false,
    editable: false,
    sorteable: false,
    filterable: true,
    filter: {
      modelValue: '',
      type: 'multiselect',
      options: branches,
    },
    cellLabel: 'owner.branch'
  },     
  {
    key: 'owner',
    label: trans('global.labels.owner'),
    show: true,
    locked: false,
    sorteable: true,
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
      key: 'name',
      label: trans('customers.labels.name'),
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
      key: 'company_name',
      label: trans('customers.labels.company_name'),
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
      key: 'branch',
      label: trans('users.labels.branch'),
      show: true,
      locked: false,
      editable: false,
      sorteable: false,
      filterable: true,
      filter: {
        modelValue: '',
        type: 'multiselect',
        options: branches,
      },
      cellLabel: 'owner.branch'
  },      
  {
      key: 'owner',
      label: trans('global.labels.owner'),
      show: true,
      locked: false,
      sorteable: true,
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
    filterable: false,
    editable: false,
    filter: {
      modelValue: '',
      type: 'select',
      options: leadCategories
    },
    edit: {
      type: 'list',
      options: leadCategories
    },
    cellKey: 'category.id',
    cellLabel: 'category.name'
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
      label: trans('deals.labels.company_name'),
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
  // {
  //     key: 'stage',
  //     label: trans('deals.labels.stage'),
  //     show: false,
  //     locked: false,
  //     editable: true,
  //     sorteable: false,
  //     filterable: true,
  //     edit: {
  //       type: 'list',
  //       options: dealStages,
  //     },
  //     filter: {
  //       modelValue: '',
  //       type: 'multiselect',
  //       options: dealStages
  //     },
  //     cellKey: 'stage.id',
  //     cellLabel: 'stage.name'  
  // },         
  {
      key: 'branch',
      label: trans('users.labels.branch'),
      show: false,
      locked: false,
      editable: false,
      sorteable: false,
      filterable: true,
      filter: {
        modelValue: '',
        type: 'multiselect',
        options: branches,
      },
      cellLabel: 'owner.branch'
  },         
  // {
  //     key: 'has_project_manager',
  //     label: trans('deals.labels.pm_in_charge'),
  //     show: false,
  //     locked: false,
  //     editable: false,
  //     sorteable: false,
  //     filterable: false,
  //     filter: {
  //       modelValue: '',
  //       type: 'input'            
  //     },
  // },         
  {
      key: 'value',
      label: trans('global.labels.value'),
      show: true,
      locked: false,
      editable: true,
      sorteable: true,
      filterable: true,
      filter: {
        modelValue: {
          minValue: null,
          maxValue: null
        },
        type: 'range'
      },       
  },         
  // {
  //     key: 'estimated_size',
  //     label: trans('deals.labels.estimated_size'),
  //     show: false,
  //     locked: false,
  //     editable: false,
  //     sorteable: false,
  //     filterable: false           
  // },         
  // {
  //     key: 'customer_responsiveness',
  //     label: trans('deals.labels.customer_responsiveness'),
  //     show: false,
  //     locked: false,
  //     editable: false,
  //     sorteable: false,
  //     filterable: false           
  // },         
  {
      key: 'estimated_close_date_range',
      label: trans('deals.labels.estimated_close_date'),
      show: false,
      locked: false,
      editable: false,
      sorteable: false,
      filterable: false           
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
      sorteable: true,
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
      key: 'category',
      label: trans('deals.labels.category'),
      show: false,
      locked: false,
      sorteable: true,
      filterable: false,
      editable: true,
      filter: {
        modelValue: '',
        type: 'select',
        options: dealCategories
      },
      edit: {
        type: 'list',
        options: dealCategories
      },
      cellKey: 'category.id',
      cellLabel: 'category.name'
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

export const cotizadoColumns = [
  {
      key: 'deal',
      label: trans('deals.labels.company_name'),
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
  // {
  //     key: 'stage',
  //     label: trans('deals.labels.stage'),
  //     show: false,
  //     locked: false,
  //     editable: true,
  //     sorteable: false,
  //     filterable: true,
  //     edit: {
  //       type: 'list',
  //       options: dealStages,
  //     },
  //     filter: {
  //       modelValue: '',
  //       type: 'multiselect',
  //       options: dealStages
  //     },
  //     cellKey: 'stage.id',
  //     cellLabel: 'stage.name'  
  // },         
  {
      key: 'branch',
      label: trans('users.labels.branch'),
      show: false,
      locked: false,
      editable: false,
      sorteable: false,
      filterable: true,
      filter: {
        modelValue: '',
        type: 'multiselect',
        options: branches,
      },
      cellLabel: 'owner.branch'
  },         
  // {
  //     key: 'has_project_manager',
  //     label: trans('deals.labels.pm_in_charge'),
  //     show: false,
  //     locked: false,
  //     editable: false,
  //     sorteable: false,
  //     filterable: false,
  //     filter: {
  //       modelValue: '',
  //       type: 'input'            
  //     },
  // },         
  {
      key: 'value',
      label: trans('deals.labels.value_quoted'),
      show: true,
      locked: false,
      editable: true,
      sorteable: true,
      filterable: true,
      filter: {
        modelValue: {
          minValue: null,
          maxValue: null
        },
        type: 'range'
      },       
  },         
  // {
  //     key: 'estimated_size',
  //     label: trans('deals.labels.estimated_size'),
  //     show: false,
  //     locked: false,
  //     editable: false,
  //     sorteable: false,
  //     filterable: false           
  // },         
  // {
  //     key: 'customer_responsiveness',
  //     label: trans('deals.labels.customer_responsiveness'),
  //     show: false,
  //     locked: false,
  //     editable: false,
  //     sorteable: false,
  //     filterable: false           
  // },         
  {
      key: 'estimated_close_date_range',
      label: trans('deals.labels.estimated_close_date'),
      show: false,
      locked: false,
      editable: false,
      sorteable: false,
      filterable: false           
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
      sorteable: true,
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
    key: 'category',
    label: trans('deals.labels.category'),
    show: true,
    locked: false,
    sorteable: true,
    filterable: false,
    editable: false,
    filter: {
      modelValue: '',
      type: 'select',
      options: dealCategories
    },
    edit: {
      type: 'list',
      options: dealCategories
    }
  },
  {
    key: 'next_task',
    label: trans('global.labels.next_task'),
    show: true,
    locked: false,
    editable: false,
    sorteable: false,
    filterable: false,
    filter: {
      modelValue: '',
      type: 'input'            
    },
    cellKey: 'lastActivetask.id',
    cellLabel: 'lastActivetask.name'
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
export const oportunidadColumns = [
  {
      key: 'deal',
      label: trans('deals.labels.company_name'),
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
  // {
  //     key: 'stage',
  //     label: trans('deals.labels.stage'),
  //     show: false,
  //     locked: false,
  //     editable: true,
  //     sorteable: false,
  //     filterable: true,
  //     edit: {
  //       type: 'list',
  //       options: dealStages,
  //     },
  //     filter: {
  //       modelValue: '',
  //       type: 'multiselect',
  //       options: dealStages
  //     },
  //     cellKey: 'stage.id',
  //     cellLabel: 'stage.name'  
  // },         
  {
      key: 'branch',
      label: trans('users.labels.branch'),
      show: false,
      locked: false,
      editable: false,
      sorteable: false,
      filterable: true,
      filter: {
        modelValue: '',
        type: 'multiselect',
        options: branches,
      },
      cellLabel: 'owner.branch'
  },         
  // {
  //     key: 'has_project_manager',
  //     label: trans('deals.labels.pm_in_charge'),
  //     show: false,
  //     locked: false,
  //     editable: false,
  //     sorteable: false,
  //     filterable: false,
  //     filter: {
  //       modelValue: '',
  //       type: 'input'            
  //     },
  // },         
  {
      key: 'value',
      label: trans('deals.labels.value_estimated'),
      show: true,
      locked: false,
      editable: true,
      sorteable: true,
      filterable: true,
      filter: {
        modelValue: {
          minValue: null,
          maxValue: null
        },
        type: 'range'
      },       
  },         
  // {
  //     key: 'estimated_size',
  //     label: trans('deals.labels.estimated_size'),
  //     show: false,
  //     locked: false,
  //     editable: false,
  //     sorteable: false,
  //     filterable: false           
  // },         
  // {
  //     key: 'customer_responsiveness',
  //     label: trans('deals.labels.customer_responsiveness'),
  //     show: false,
  //     locked: false,
  //     editable: false,
  //     sorteable: false,
  //     filterable: false           
  // },         
  {
      key: 'estimated_close_date_range',
      label: trans('deals.labels.estimated_close_date'),
      show: false,
      locked: false,
      editable: false,
      sorteable: false,
      filterable: false           
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
      sorteable: true,
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
      key: 'category',
      label: trans('deals.labels.category'),
      show: true,
      locked: false,
      sorteable: true,
      filterable: false,
      editable: false,
      filter: {
        modelValue: '',
        type: 'select',
        options: dealCategories
      },
      edit: {
        type: 'list',
        options: dealCategories
      }
  },
  {
    key: 'next_task',
    label: trans('global.labels.next_task'),
    show: true,
    locked: false,
    editable: false,
    sorteable: false,
    filterable: false,
    filter: {
      modelValue: '',
      type: 'input'            
    },
    cellKey: 'lastActivetask.id',
    cellLabel: 'lastActivetask.name'
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