@isTest
public with sharing class ContactsTest {
    @isTest
    static void getContactByUserIdShouldReturnEmpty(){
        List<Contact> results;

        Test.startTest();
        results = new Contacts().getContactByUserId(null);
        Test.stopTest();

        System.assertEquals(0, results.size(), 'Should return an empty list when no user id provided');
    }
}