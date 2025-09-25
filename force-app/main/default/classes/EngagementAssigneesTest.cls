@isTest
public with sharing class EngagementAssigneesTest {
    @isTest
    static void getEngagementAssigneeWithCriteriaShouldReturnEmpty(){
        List<Engagement_Assignee__c> results;

        Test.startTest();
        results = new EngagementAssignees().getEngagementAssigneeWithCriteria(null);
        Test.stopTest();

        System.assertEquals(0, results.size(), 'Should return an empty list when no id provided');
    }
}