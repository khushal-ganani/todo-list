import { LightningElement, wire, track } from 'lwc';

// Lightning Message Service and message channels
import { subscribe, MessageContext } from 'lightning/messageService';
import TODOS_FILTERED_MESSAGE from '@salesforce/messageChannel/TodosFiltered__c';

export default class TodoManager extends LightningElement {

    /** JSON.stringified version of filters to pass to apex */
    @track filters = {
        sortBy: "Due_Date__c ASC"
    };

    /** Load context for Lightning Messaging Service */
    @wire(MessageContext) messageContext;

    /** Subscription for ProductsFiltered Lightning message */
    todoFilterSubscription;

    connectedCallback() {
        console.log("connectedCallback called on todoManager!!");
        // Subscribe to ProductsFiltered message
        this.todoFilterSubscription = subscribe(
            this.messageContext,
            TODOS_FILTERED_MESSAGE,
            (message) => {
                console.log("message from filterTodo Component through LMS: ", message);
                this.handleFilterChange(message)
            }
        );
    }

    /**
    * method to change the filters based on the message received from the filterTodo component
    */
    handleFilterChange(message) {
        console.log("handleFilterChange() on todoManager called with filter data as: ", message);
        this.filters = { ...message.filters };
    }
}