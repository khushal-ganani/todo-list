import { LightningElement, wire } from 'lwc';

import getDatatableTodos from '@salesforce/apex/TodoController.getDatatableTodos';

import { refreshApex } from '@salesforce/apex'

import TODO_NAME_FIELD from '@salesforce/schema/To_Do__c.Name';
import TODO_TYPE_FIELD from '@salesforce/schema/To_Do__c.Type__c';
import TODO_PRIORITY_FIELD from '@salesforce/schema/To_Do__c.Priority__c';
import TODO_DUE_DATE_FIELD from '@salesforce/schema/To_Do__c.Due_Date__c';

const COLUMNS = [
    { label: 'Title', fieldName: TODO_NAME_FIELD.fieldApiName, type: 'text', cellAttributes: {
        class: {
            fieldName: "titleColor"
        }
    }},
    { label: 'Type', fieldName: TODO_TYPE_FIELD.fieldApiName, type: 'text' },
    { label: 'Priority', fieldName: TODO_PRIORITY_FIELD.fieldApiName, type: 'text' },
    { label: 'D;ue Date', fieldName: TODO_DUE_DATE_FIELD.fieldApiName, type: 'date' },
]

export default class TodoDatatable extends LightningElement {
    columns = COLUMNS;
    todos;
    error;
    pageNumber = 1;
    wireResult;


    @wire(getDatatableTodos, { pageNumber: "$pageNumber"})
    wiredData( result ) {
        this.wireResult = result
        if (result.data) {
            // this.todos = result.data;
            this.todos = result.data.map((result) => {
                let titleColor = "slds-text-color_success";
                return {
                    ...result,
                    titleColor: titleColor
                }
            })
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.todos = undefined;
        }
    }

    handlePreviousPage() {
        this.pageNumber = this.pageNumber - 1;
    }

    handleNextPage() {
        this.pageNumber = this.pageNumber + 1;
    }

    async handleRefresh(){
        await refreshApex(this.wireResult);
    }
}