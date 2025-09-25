public without sharing class Contacts {
    private ContactsDao dao;

    public Contacts(){
        this.dao = new ContactsDao();
    }

    public List<Contact> getContactByUserId(Id userId){
        return this.dao.fetchContactByUserId(userId);
    }
}