@isTest
public with sharing class ContactsDaoTest {
    @isTest
    static void itShouldFetchNothing(){
        List<Contact> results;

        Test.startTest();
        results = new ContactsDao().fetchContactByUserId(null);
        Test.stopTest();

        System.assertEquals(0, results.size(), 'nothing should be getting returned here');
    }
}