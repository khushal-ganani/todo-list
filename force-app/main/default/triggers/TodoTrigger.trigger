trigger TodoTrigger on To_Do__c (after insert, after update, after delete) {

    // Instantiate the trigger handler
    ToDoTriggerHandler handler = new ToDoTriggerHandler();

    // Run the trigger handler
    handler.run();
}