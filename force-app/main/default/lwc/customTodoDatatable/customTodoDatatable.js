import { LightningElement, wire, track } from 'lwc';

import getDatatableTodos from '@salesforce/apex/TodoController.getDatatableTodos';
import updateTodos from '@salesforce/apex/TodoController.updateTodos';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { refreshApex } from '@salesforce/apex'
import { notifyRecordUpdateAvailable } from "lightning/uiRecordApi";

import TODO_OBJECT from '@salesforce/schema/To_Do__c'
import TODO_NAME_FIELD from '@salesforce/schema/To_Do__c.Name';
import TODO_TYPE_FIELD from '@salesforce/schema/To_Do__c.Type__c';
import TODO_PRIORITY_FIELD from '@salesforce/schema/To_Do__c.Priority__c';
import TODO_DUE_DATE_FIELD from '@salesforce/schema/To_Do__c.Due_Date__c';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';

const COLUMNS = [
    { 
        label: 'Title', 
        fieldName: TODO_NAME_FIELD.fieldApiName, 
        type: 'customTodoTitle', 
        typeAttributes: {
            titleTodo: {
                fieldName: "titleTodo"
            },
            colorTodoTitle: {
                fieldName: "colorTodoTitle"
            }
        }
    },
    { 
        label: 'Type', 
        fieldName: TODO_TYPE_FIELD.fieldApiName, 
        type: 'customTodoType', typeAttributes: {
            typeTodo: {
                fieldName: "typeTodo"
            }
        }
    },
    { 
        label: 'Priority', 
        fieldName: TODO_PRIORITY_FIELD.fieldApiName, 
        type: 'customTodoPriority',
        editable: true, 
        typeAttributes: {
            priorityTodo: { fieldName: "priorityTodo" },
            options: { fieldName: "priorityOptions" },
            context: { fieldName: "Id" }
        } 
    },
    { 
        label: 'Due Date', 
        fieldName: TODO_DUE_DATE_FIELD.fieldApiName, 
        type: 'customTodoDueDate', 
        typeAttributes: {
            dueDateTodo: {
                fieldName: "dueDateTodo"
            }
        } 
    },
]

export default class CustomTodoDatatable extends LightningElement {
    columns = COLUMNS;
    todos = [];
    @track draftValues = [];
    error;
    pageNumber = 1;
    wireResult;
    priorityOptions = [];

    @wire(getObjectInfo, { objectApiName: TODO_OBJECT })
    objectInfo

    @wire (getPicklistValues, {
        recordTypeId : "$objectInfo.data.defaultRecordTypeId",
        fieldApiName : TODO_PRIORITY_FIELD
    }) 
    getPriorityPicklistValues ( {data, error} ) {
        if(data) {
            this.priorityOptions = data.values;
        } else if (error) {
            console.log('error while retreiving priority field picklist values: ', error);
        }
    }

    @wire(getDatatableTodos, { pageNumber: "$pageNumber", pickList: "$priorityOptions"})
    wiredData( result ) {
        this.wireResult = result
        if (result.data) {
            // this.todos = result.data;
            this.todos = result.data.map((result) => {
                let titleColor = "slds-text-color_success";
                let typeTodo = result.Type__c;
                let dueDateTodo = result.Due_Date__c;
                let priorityTodo = result.Priority__c;
                let titleTodo = result.Name;
                let colorTodoTitle = '#55318a';
                let priorityOptions = this.priorityOptions;
                return {
                    ...result,
                    titleColor: titleColor,
                    typeTodo: typeTodo,
                    dueDateTodo: dueDateTodo,
                    priorityTodo: priorityTodo,
                    priorityOptions: priorityOptions,
                    titleTodo: titleTodo,
                    colorTodoTitle: colorTodoTitle
                }
            })
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.todos = undefined;
        }
    }

    async handleSave(event) {
        let updateDraftValues = event.detail.draftValues;
        console.log('draft-values: ', updateDraftValues);

        // Prepare the record IDs for notifyRecordUpdateAvailable()
        const notifyChangeIds = updateDraftValues.map(row => { return { "recordId": row.Id } });

        try {
            // this.draftValues = [];
            const result = await updateTodos({ updatedData: updateDraftValues });
            console.log('result from apex controller: ', result);

            const toastEvent = new ShowToastEvent({
                title: 'Records Updated',
                message: 'To-do Records were updated successfully!',
                variant: 'success'
            });
            this.dispatchEvent(toastEvent);

            //! Refresh LDS cache and wires
            //! notifyRecordUpdateAvailable(recordIds): Informs Lightning Data Service that record data has changed so 
            //! that Lightning Data Service can take the appropriate actions to keep wire adapters updated with the latest
            //! record data. Call this function to notify Lightning Data Service that a record has changed outside its 
            //! mechanisms, such as via imperative Apex or by calling User Interface API via a third-party framework. 
            //! This function supersedes getRecordNotifyChange(recordIds).
            notifyRecordUpdateAvailable(notifyChangeIds);

            this.draftValues = [];
            await refreshApex(this.wireResult);
            console.log('refresh apex finished executing');
        } catch(error) {
            console.log('InlineEditUsingApexController apex result error: ', error);
            this.draftValues = updateDraftValues;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or refreshing the record!',
                    message: 'An unexpected error occurred: ' + error.body.message,
                    variant: 'error'
                })
            );
        } finally {
            this.draftValues = [];
            console.log('finally blocked executed');
        }
    }

    async handleRefresh(){
        await refreshApex(this.wireResult);
    }
    
    handlePreviousPage() {
        this.pageNumber = this.pageNumber - 1;
    }

    handleNextPage() {
        this.pageNumber = this.pageNumber + 1;
    }
}