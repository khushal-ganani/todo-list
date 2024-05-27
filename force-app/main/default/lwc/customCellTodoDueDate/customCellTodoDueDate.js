import { LightningElement, api } from 'lwc';

export default class CustomCellTodoDueDate extends LightningElement {
    label;

    @api
    get todoDueDate(){
        return this.label;
    }

    set todoDueDate(value){
        this.label = this.formatDueDate(value);
    }

    formatDueDate(dueDate) {
        const options = { day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric', hour12: true };
        return new Intl.DateTimeFormat('en-US', options).format(new Date(dueDate));
    }
}