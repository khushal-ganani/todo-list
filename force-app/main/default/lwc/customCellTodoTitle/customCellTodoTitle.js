import { LightningElement, api } from 'lwc';

export default class CustomCellTodoTitle extends LightningElement {
    style;
    text;
    textColor;

    @api 
    get title(){
        return this.text;
    };

    set title(value) {
        this.text = value;
    }

    @api 
    get color() {
        return this.textColor;
    };
    
    set color(value) {
        this.textColor = value;
        this.style = `color: ${value}`;
    }
}