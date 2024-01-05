import { LightningElement, api, wire } from 'lwc';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import TO_DO_COMPLETED_FIELD from '@salesforce/schema/To_Do__c.Completed__c';

import TO_DO_NAME_FIELD from '@salesforce/schema/To_Do__c.Name';
import TO_DO_TYPE_FIELD from '@salesforce/schema/To_Do__c.Type__c';
import TO_DO_PRIORITY_FIELD from '@salesforce/schema/To_Do__c.Priority__c';
import TO_DO_DUE_DATE_FIELD from '@salesforce/schema/To_Do__c.Due_Date__c';
import TO_DO_DESCRIPTION_FIELD from '@salesforce/schema/To_Do__c.Description__c';

const fields = [TO_DO_NAME_FIELD, TO_DO_COMPLETED_FIELD, TO_DO_TYPE_FIELD, TO_DO_PRIORITY_FIELD, TO_DO_DUE_DATE_FIELD, TO_DO_DESCRIPTION_FIELD];

export default class TodoCard extends LightningElement {

    @api recordId
    data;
    error;
    completedState = false;
    
    @wire(getRecord, {recordId: '$recordId', fields})
    toDoRecord({error, data}){
        if(data){
            this.data = data;
            this.error = undefined;
            console.log('Initial toDoRecord data: ',data);
            this.completedState = data.fields.Completed__c.value;
            console.log("Initial completedState: ", this.completedState);
        } else if(error){
            this.error = error;
            this.data = undefined;
            this.completedState = false;
            console.error('error in wire record: ',error);
        }
    }

    @api
    get cardTitle(){
        return this.data.fields.Name.value;
    }

    @api
    get dueDate(){
        return this.data.fields.Due_Date__c.displayValue;
    }

    @api
    get description(){
        return this.data.fields.Description__c.value;
    }

    @api
    get priorityBadgeLabel(){
        return this.data.fields.Priority__c.value;
    }

    @api
    get typeBadgeLabel(){
        return this.data.fields.Type__c.value;
    }

    @api
    get iconName() {
        console.log('Entered get iconName()');
        const type = this.data && this.data.fields.Type__c.value;
        console.log('Type in get iconName(): ', type);
        // different icons for To-Do cards with following types: Personal, Work, Academic, Health, Social, Household,
        // Hobbies, Self-Improvement, Other.
        switch (type) {
            case "Personal":
                return "utility:socialshare";
            case "Work":
                return "utility:company";
            case "Academic":
                return "utility:knowledge_base";
            case "Health":
                return "utility:center_align";
            case "Social":
                return "utility:groups";
            case "Household":
                return "utility:home";
            case "Hobbies":
                return "utility:brush";
            case "Self-Improvement":
                return "utility:trending";
            case "Other":
                return "utility:task";
            
            default:
                console.warn('Unexpected or undefined type:', type);
                return "utility:task"; // Default icon for unexpected types
        }
    }

    @api
    get priorityBadgeColor(){
        let color;
        const priority = this.data.fields.Priority__c.value;
        if(priority === "High"){
            color = 'red';
        } else if(priority === "Medium"){
            color = 'yellow';
        } else if(priority === "Low"){
            color = 'green'
        }
        return `--slds-c-badge-color-background: ${color}`
    }

    async handleCompletion(event) {
        let completed;
        console.log(event.target);
        try{
            console.log("entered handleCompletion");
            completed = this.data.fields.Completed__c.value
            const recordInput = { fields: { Id: this.recordId, Completed__c: !completed } };

            const result = await updateRecord(recordInput)
            console.log("result from updateRecord(): ",result);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: `To-Do ${completed ? 'unmarked' : 'marked'} as completed.`,
                    variant: 'success',
                })
            );
        } catch(error) {
            console.error('Error updating record: ', error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'An error occurred while updating the record.',
                    variant: 'error',
                })
            );
        } finally {
            console.log("entered finally block of handleCompletion");
            this.data.fields.Completed__c.value, this.completedState = !completed;
            console.log("Completed value in data: ", this.data.fields.Completed__c.value);
            console.log("completedState: ", this.completedState);
        }
    }
}