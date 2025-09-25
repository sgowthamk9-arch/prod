public without sharing class ContactsDao {
    public List<Contact> fetchContactByUserId(Id assigneeRecordId){
        return Database.query('SELECT Id, Account.Name, Country_Location_Name__c FROM Contact WHERE User__c = :assigneeRecordId');
    }
}