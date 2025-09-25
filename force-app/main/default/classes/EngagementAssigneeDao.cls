public without sharing class EngagementAssigneeDao {
    public List<Engagement_Assignee__c> fetchEngagementAssigneeWithCriteria(Id assigneeId){
        String query = 'SELECT ' +
                        'Id, ' +
                        'Engagements__r.Coordinating_Office__c, ' +
                        'Engagements__r.Client__r.Name, ' +
                        'toLabel(Assignment_Country__c), ' +
                        'Assignee__c ' +
                        'FROM Engagement_Assignee__c WHERE Assignee__r.User__pc = :assigneeId ' +
                        'AND Status__c = \'Active\'';
        
        query += ' ORDER BY CreatedDate DESC';
        return Database.query(query);
    }
}