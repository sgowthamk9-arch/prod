public without sharing class acx_PortalEmailsController {
    @testVisible
    private EngagementAssignees engagementAssignees;
    @testVisible
    private Contacts contacts;
    
    public class EmailData {
        public String clientName { get; set; }
        public String hostCountry { get; set; }
        
        public EmailData() {
            this.clientName = '';
            this.hostCountry = '';
        }
    }
    
    private EmailData emailDataInternal;
    public Id assigneeRecordId { get; set; }
    private Boolean initialized = false;
    
    public acx_PortalEmailsController() {
        this.engagementAssignees = new EngagementAssignees();
        this.contacts = new Contacts();
        this.emailDataInternal = new EmailData();
    }
    
    private void initialize() {
        if (!initialized && assigneeRecordId != null) {
            try {
                List<Engagement_Assignee__c> assigneeResults = 
                    this.engagementAssignees.getEngagementAssigneeWithCriteria(this.assigneeRecordId);
                
                if (assigneeResults != null && !assigneeResults.isEmpty()) {
                    Engagement_Assignee__c assigneeRecord = assigneeResults[0];
                    
                    if (assigneeRecord.Engagements__r != null && 
                        assigneeRecord.Engagements__r.Client__r != null) {
                        this.emailDataInternal.clientName = assigneeRecord.Engagements__r.Client__r.Name;
                    }
                    this.emailDataInternal.hostCountry = assigneeRecord.Assignment_Country__c;
                } else {
                    List<Contact> contactResults = 
                        this.contacts.getContactByUserId(this.assigneeRecordId);
                    
                    if (contactResults != null && !contactResults.isEmpty()) {
                        Contact clientContact = contactResults[0];
                        
                        if (clientContact.Account != null) {
                            this.emailDataInternal.clientName = clientContact.Account.Name;
                        }
                        this.emailDataInternal.hostCountry = clientContact.Country_Location_Name__c;
                    }
                }
                
            } catch (Exception e) {
                System.debug(LoggingLevel.ERROR, 'Error initializing email data: ' + e.getMessage());
            } finally {
                initialized = true;
            }
        }
    }
    
    public EmailData getEmailData() {
        initialize();
        return this.emailDataInternal;
    }
}