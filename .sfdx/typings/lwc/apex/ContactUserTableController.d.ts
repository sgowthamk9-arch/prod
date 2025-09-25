declare module "@salesforce/apex/ContactUserTableController.getTopUsers" {
  export default function getTopUsers(param: {numberOfUsers: any}): Promise<any>;
}
declare module "@salesforce/apex/ContactUserTableController.getEngagementUsers" {
  export default function getEngagementUsers(): Promise<any>;
}
declare module "@salesforce/apex/ContactUserTableController.getUsers" {
  export default function getUsers(param: {userId: any, numberOfUsers: any, workRecordType: any, workRecordCountry: any}): Promise<any>;
}
