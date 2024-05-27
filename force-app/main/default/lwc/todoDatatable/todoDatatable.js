import LightningDatatable from 'lightning/datatable';

import customTodoTypeTemplate from './customTodoType.html'
import customTodoTitleTemplate from './customTodoTitle.html'
import customTodoPriorityTemplate from './customTodoPriority.html'
import customTodoDueDateTemplate from './customTodoDueDate.html'
import customTodoEditPicklistTemplate from './customTodoPicklist.html'

export default class TodoDatatable extends LightningDatatable {
    static customTypes = {
        customTodoType: {
            template: customTodoTypeTemplate,
            standardCellLayout: true,
            typeAttributes: ['typeTodo']
        },
        customTodoDueDate: {
            template: customTodoDueDateTemplate,
            standardCellLayout: true,
            typeAttributes: ['dueDateTodo']
        },
        customTodoPriority: {
            template: customTodoPriorityTemplate,
            editTemplate: customTodoEditPicklistTemplate,
            standardCellLayout: true,
            typeAttributes: ['priorityTodo', 'options', 'context']
        },
        customTodoTitle: {
            template: customTodoTitleTemplate,
            standardCellLayout: true,
            typeAttributes: ['titleTodo', 'colorTodoTitle']
        }
    };
}