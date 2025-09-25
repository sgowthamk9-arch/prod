@isTest
public class acx_PortalEmailsControllerTest {

    @isTest
    static void itShouldPopulateEmailDataFromEngagementAssignee(){
        // Stub EngagementAssignees to return a fake Engagement_Assignee__c
        Stub engagementAssigneesStub = new Stub(EngagementAssignees.class);

        Engagement_Assignee__c fakeAssignee = new Engagement_Assignee__c();
        fakeAssignee.Assignment_Country__c = 'Germany';
        // Use JSON trick to populate nested relationship names without DML
        String engagementJson = '{"Engagements__r":{"Client__r":{"Name":"Acme Corp"}}}';
        fakeAssignee = (Engagement_Assignee__c)JSON.deserialize(
            JSON.serialize(fakeAssignee).substring(0, JSON.serialize(fakeAssignee).length()-1) + ',' +
            engagementJson.substring(1),
            Engagement_Assignee__c.class
        );

        engagementAssigneesStub.setReturnValue('getEngagementAssigneeWithCriteria', new List<Engagement_Assignee__c>{ fakeAssignee });

        acx_PortalEmailsController controller = new acx_PortalEmailsController();
        controller.engagementAssignees = (EngagementAssignees) engagementAssigneesStub.instance;
        controller.assigneeRecordId = TestUtility.getFakeId(User.SObjectType);

        Test.startTest();
        acx_PortalEmailsController.EmailData data = controller.getEmailData();
        Test.stopTest();

        System.assertEquals('Acme Corp', data.clientName, 'clientName should come from Engagements__r.Client__r.Name');
        System.assertEquals('Germany', data.hostCountry, 'hostCountry should come from Assignment_Country__c');
    }

    @isTest
    static void itShouldFallbackToContactWhenNoAssigneeFound(){
        // Stub EngagementAssignees to return empty and Contacts to return a fake Contact with Account
        Stub engagementAssigneesStub = new Stub(EngagementAssignees.class);
        engagementAssigneesStub.setReturnValue('getEngagementAssigneeWithCriteria', new List<Engagement_Assignee__c>());

        Stub contactsStub = new Stub(Contacts.class);
        Account fakeAccount = (Account)JSON.deserialize('{"Name":"Globex"}', Account.class);
        Contact fakeContact = (Contact)JSON.deserialize('{"Account":' + JSON.serialize(fakeAccount) + ',"Country_Location_Name__c":"Canada"}', Contact.class);
        contactsStub.setReturnValue('getContactByUserId', new List<Contact>{ fakeContact });

        acx_PortalEmailsController controller = new acx_PortalEmailsController();
        controller.engagementAssignees = (EngagementAssignees) engagementAssigneesStub.instance;
        controller.contacts = (Contacts) contactsStub.instance;
        controller.assigneeRecordId = TestUtility.getFakeId(User.SObjectType);

        Test.startTest();
        acx_PortalEmailsController.EmailData data = controller.getEmailData();
        Test.stopTest();

        System.assertEquals('Globex', data.clientName, 'clientName should come from Contact.Account.Name');
        System.assertEquals('Canada', data.hostCountry, 'hostCountry should come from Contact.Country_Location_Name__c');
    }

    @isTest
    static void itShouldRemainEmptyWhenNoIdsOrData(){
        acx_PortalEmailsController controller = new acx_PortalEmailsController();
        // Do not set assigneeRecordId → initialize should not run

        Test.startTest();
        acx_PortalEmailsController.EmailData data = controller.getEmailData();
        Test.stopTest();

        System.assertEquals('', data.clientName, 'clientName should remain empty by default');
        System.assertEquals('', data.hostCountry, 'hostCountry should remain empty by default');
    }
}