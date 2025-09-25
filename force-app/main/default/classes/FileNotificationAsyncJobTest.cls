@isTest
public class FileNotificationAsyncJobTest {

    @isTest
    private static void itShouldCallTheJob(){
        Stub jobStub = new Stub(fileNotificationJob.class);
        jobStub.setReturnValue('hasItems', true);
        jobStub.setReturnValue('sendNotifications', null);
        
        FileNotificationAsyncJob asyncJob = new FileNotificationAsyncJob((FileNotificationJob)jobStub.instance);
        
        test.startTest();
        
        asyncJob.execute(null);
        test.stopTest();
        
        jobStub.assertInvoked('hasItems');
        jobStub.assertInvoked('sendNotifications');
    }
}