import { LightningElement, wire, api } from 'lwc';

// Lightning Message Service and message channels
import { subscribe, MessageContext } from 'lightning/messageService';
import TODOS_FILTERED_MESSAGE from '@salesforce/messageChannel/TodosFiltered__c';

//* getTodoData() method in ProductController Apex class
import getTodoData from '@salesforce/apex/TodoController.getTodoData';

// client/formFactor module to determine the size/orientation of the client device
import FORM_FACTOR from '@salesforce/client/formFactor';

export default class TodoCardList extends LightningElement {

    @api flexipageRegionWidth;

    /** Current page in the todo list. */
    pageNumber = 1;

    /** The number of items on a page. */
    pageSize = this.getPageSize();

    /** The total number of items matching the selection. */
    totalItemCount = 0;

    /** JSON.stringified version of filters to pass to apex */
    filters = {
        sortBy: "Due_Date__c ASC"
    };

    /** Load context for Lightning Messaging Service */
    @wire(MessageContext) messageContext;

    /** Subscription for ProductsFiltered Lightning message */
    todoFilterSubscription;

    /**
     * Load the list of Todo's.
     */
    @wire(getTodoData, { filters: '$filters', pageSize: '$pageSize', pageNumber: '$pageNumber' })
    todos

    connectedCallback() {
        console.log("connectedCallback called on todoCardList!!");
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
        console.log("handleFilterChange() on todoCardFilter called with filter data as: ", message);
        this.filters = { ...message.filters };
        this.pageNumber = 1;
    }

    handlePreviousPage() {
        this.pageNumber = this.pageNumber - 1;
    }

    handleNextPage() {
        this.pageNumber = this.pageNumber + 1;
    }

    /**
     * gridClass property to return slds-size classes based on FORM_FACTOR to make
     * the component responsive.
     */
    @api
    get gridClass() {
        if (FORM_FACTOR === "Small") {
            return "slds-col slds-size_1-of-1 slds-var-p-around_small";
        } else if (FORM_FACTOR === "Medium") {
            return "slds-col slds-size_1-of-2 slds-var-p-around_small";
        } else {
            return "slds-col slds-size_1-of-3 slds-var-p-around_small";
        }
    }

    /** 
     * function to get pageSize to Limit the number of todo record data
     * displayed to make the app responsive
     */ 
    @api
    getPageSize(){
        return FORM_FACTOR === "Large"
        ? 9
        : FORM_FACTOR === "Medium"
        ? 6
        : 3;
    }
}