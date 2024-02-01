public with sharing class TodoTriggerHandler extends TriggerHandler {

    protected override void afterInsert() {
        // Call the future method for making Google Tasks API call to insert the Google Tasks
        insertGoogleTasks(getRecordIds(Trigger.new)); 
    }

    protected override void afterUpdate() {
        sObject todo = Trigger.old[0];
        if(todo instanceof To_Do__c && ((To_Do__c)todo).Google_Task_Id__c != null){
            // Call the future method for making Google Tasks API call to update the Google Tasks
            updateGoogleTasks(getRecordIds(Trigger.new));
        }
    }

    protected override void afterDelete() {
        Map<String, String> googleTaskDetailsMap = new Map<String,String>();
        for (SObject todo : Trigger.old) {
            if (todo instanceof To_Do__c) {
                googleTaskDetailsMap.put(((To_Do__c)todo).Google_Task_Id__c, getGoogleTaskListId(((To_Do__c)todo).Type__c));
            }
        }
        if (!googleTaskDetailsMap.isEmpty()) {
            // Call the future method for making Google Tasks API call to update the Google Tasks
            deleteGoogleTasks(googleTaskDetailsMap); 
        }
        
    }

    @future(callout=true)
    public static void insertGoogleTasks(List<Id> todoIds) {

        // Query necessary information based on Ids
        List<To_Do__c> todoList = [SELECT Id, Name, Type__c, Priority__c, Description__c, Due_Date__c, Completed__c,
                                    Completed_On__c, Google_Task_Id__c FROM To_Do__c WHERE Id = :todoIds];

        // Make the callout using the retrieved data
        for (To_Do__c todo : todoList) {
            
            GoogleTasksJSON taskObject = new GoogleTasksJSON();
            Http http = new Http();
            HttpRequest request = new HttpRequest();

            String taskListId = getGoogleTaskListId(todo.Type__c);

            taskObject.kind = 'tasks#task';
            taskObject.title = todo.Name;
            taskObject.notes = todo.Description__c;
            taskObject.status = getStatus(todo.Completed__c);
            taskObject.due = JSON.serialize(todo.Due_Date__c).replace('"', '');
            taskObject.deleted = false;
            taskObject.hidden = false;
            if (todo.Completed__c && todo.Completed_On__c != null) {
                taskObject.completed = JSON.serialize(todo.Completed__c).replace('"', '');
            }

            String body = JSON.serialize(taskObject, true);

            request.setHeader('Accept', 'application/json');
            request.setHeader('Content-Type', 'application/json');
            request.setBody(body);
            request.setTimeout(12000);
            request.setMethod('POST');
            request.setEndpoint('callout:googleTasks/tasks/v1/lists/' + taskListId + '/tasks');
            
            HttpResponse jsonResponse = http.send(request);
            String responseBody = jsonResponse.getBody();

            GoogleTasksJSON response = GoogleTasksJSON.parse(responseBody);

            if (jsonResponse.getStatusCode() == 200) {
                System.debug('response from Google Tasks API: ' + response);
                todo.Google_Task_Id__c = response.id;
            } else {
                System.debug('Error occured in the callout: ' + response);
            }
        }

        Database.SaveResult[] saveResult = Database.update(todoList, false);
        for(Database.SaveResult sr : saveResult) {
            if (sr.isSuccess()) {
                System.debug('Succesfully updated the Google Task Id field on the insert trigger');
            } else {
                for (Database.Error err : sr.getErrors()) {
                    System.debug('The following error has occured: ');
                    System.debug(err.getStatusCode() + ': ' + err.getMessage());
                    System.debug('Fields that affected this error: ' + err.getFields());
                }
            }
        }
    }

    @future(callout=true)
    public static void updateGoogleTasks(List<Id> todoIds) {

        // Query necessary information based on Ids
        List<To_Do__c> todoList = [SELECT Id, Name, Type__c, Priority__c, Description__c, Due_Date__c, Completed__c,
                                    Completed_On__c, Google_Task_Id__c FROM To_Do__c WHERE Id IN :todoIds];

        // Make the callout using the retrieved data
        for (To_Do__c todo : todoList) {
            
            GoogleTasksJSON taskObject = new GoogleTasksJSON();
            Http http = new Http();
            HttpRequest request = new HttpRequest();

            String taskListId = getGoogleTaskListId(todo.Type__c);

            taskObject.kind = 'tasks#task';
            taskObject.title = todo.Name;
            taskObject.notes = todo.Description__c;
            taskObject.status = getStatus(todo.Completed__c);
            taskObject.due = JSON.serialize(todo.Due_Date__c).replace('"', '');
            taskObject.deleted = false;
            taskObject.hidden = false;
            if (todo.Completed__c && todo.Completed_On__c != null) {
                taskObject.completed = JSON.serialize(todo.Completed__c).replace('"', '');
            }

            String body = JSON.serialize(taskObject, true);

            request.setHeader('Accept', 'application/json');
            request.setHeader('Content-Type', 'application/json');
            request.setBody(body);
            request.setTimeout(12000);
            request.setMethod('PATCH');
            request.setEndpoint('callout:googleTasks/tasks/v1/lists/' + taskListId + '/tasks/' + todo.Google_Task_Id__c);
            
            HttpResponse jsonResponse = http.send(request);
            String responseBody = jsonResponse.getBody();

            GoogleTasksJSON response = GoogleTasksJSON.parse(responseBody);

            if (jsonResponse.getStatusCode() == 200) {
                System.debug('response from Google Tasks API to update Google Task: ' + response);
            } else {
                System.debug('Error occured in the callout to update Google Task: ' + response);
            }
        }
    }

    @future(callout = true)
    public static void deleteGoogleTasks(Map<String, String> googleTaskDetailsMap) {

        System.debug('Entered the deleteGoogleTasks @future method');

        // make callouts for each record that is being deleted
        for (String googleTaskId : googleTaskDetailsMap.keySet()) {

            Http http = new Http();
            HttpRequest request = new HttpRequest();

            request.setHeader('Accept', 'application/json');
            request.setMethod('DELETE');
            request.setTimeout(12000);
            request.setEndpoint('callout:googleTasks/tasks/v1/lists/' + googleTaskDetailsMap.get(googleTaskId) + '/tasks/' + googleTaskId);
            System.debug('Endpoint URL for DELETE request: '+request.getEndpoint());

            HttpResponse jsonResponse = http.send(request);
            System.debug('Status code from DELETE request to Google Tasks API is: '+jsonResponse.getStatusCode());

            if (jsonResponse.getStatusCode() == 204) {
                System.debug('successfully deleted Google Task !!');
            } else {
                String responseBody = jsonResponse.getBody();
                System.debug('Error occured in deleting the Google Task in the callout: ');
                System.debug(responseBody);
            }
        }
    }

    static List<Id> getRecordIds(List<To_Do__c> todos) {
        List<Id> recordIds = new List<Id>();
        for (To_Do__c todo : todos) {
            recordIds.add(todo.Id);
        }
        return recordIds;
    }

    static String getStatus(Boolean completed){
        String status;
        if(!completed){
            status = 'needsAction';
        } else if (completed) {
            status = 'completed';
        }
        return status;
    }

    static String getGoogleTaskListId(String type) {
        String taskListId;
        if (type == 'Self'+'-'+'Improvement') {
            taskListId = 'OFp0ZFcyQnpBYWp3QXltTQ';
        } else {
            switch on type {
                when 'Personal' {
                    taskListId = 'MUs0SU11N1J3Z254RzZwVw';
                }
                when 'Work' {
                    taskListId = 'N2dMX3o3U1JFSDVPVnp2RQ';
                }
                when 'Academic' {
                    taskListId = 'ZWl6X2xZTFMweEpwY1VrZg';
                }
                when 'Health' {
                    taskListId = 'RkJsODVud3VIVjNXTi1TQg';
                }
                when 'Social' {
                    taskListId = 'YTBLLWcyZFZvQVZLMGl1Mw';
                }
                when 'Household' {
                    taskListId = 'RjB6SU1OWlU4MXJZc1B2Yg';
                }
                when 'Hobbies' {
                    taskListId = 'YzgzeGVqS0M5aU9GQU43VA';
                }
                when 'Other' {
                    taskListId = 'dXBKM09FZm1jODRZVlhBYQ';
                }
                when else {
                    taskListId = '';
                }
            }
        }    
        return taskListId;
    }    
}