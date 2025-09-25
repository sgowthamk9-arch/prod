public without sharing class EngagementAssignees {
    @testVisible
    private EngagementAssigneeDao dao;

    public EngagementAssignees(){
        this.dao = new EngagementAssigneeDao();
    }

    public List<Engagement_Assignee__c> getEngagementAssigneeWithCriteria(Id assigneeId){
        return this.dao.fetchEngagementAssigneeWithCriteria(assigneeId);
    }
}