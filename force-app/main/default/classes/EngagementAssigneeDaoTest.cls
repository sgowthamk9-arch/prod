@isTest
public with sharing class EngagementAssigneeDaoTest {
    @isTest
    static void itShouldFetchNothing(){
        List<Engagement_Assignee__c> results;

        Test.startTest();
        results = new EngagementAssigneeDao().fetchEngagementAssigneeWithCriteria(null);
        Test.stopTest();

        System.assertEquals(0, results.size(), 'nothing should be getting returned here');
    }
}