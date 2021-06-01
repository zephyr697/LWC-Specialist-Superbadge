import { LightningElement } from 'lwc';

// Custom Labels Imports
// import labelDetails for Details
import labelDetails from '@salesforce/label/c.Details';
// import labelReviews for Reviews
import labelReviews from '@salesforce/label/c.Reviews';
// import labelAddReview for Add_Review
import labelAddReview from '@salesforce/label/c.Add_Review';
// import labelFullDetails for Full_Details
import labelFullDetails from '@salesforce/label/c.Full_Details'
// import labelPleaseSelectABoat for Please_select_a_boat
import labelPleaseSelectABoat from '@salesforce/label/c.Please_select_a_boat';

// Boat__c Schema Imports
// import BOAT_ID_FIELD for the Boat Id
import BOAT_ID_FIELD from '@salesforce/schema/Boat__c.Id';
// import BOAT_NAME_FIELD for the boat Name
import BOAT_NAME_FIELD from '@salesforce/schema/Boat__c.Name';

const BOAT_FIELDS = [BOAT_ID_FIELD, BOAT_NAME_FIELD];
export default class BoatDetailTabs extends LightningElement {
  boatId;
  wiredRecord;
  label = {
    labelDetails,
    labelReviews,
    labelAddReview,
    labelFullDetails,
    labelPleaseSelectABoat,
  };

  // Decide when to show or hide the icon
  // returns 'utility:anchor' or null
  get detailsTabIconName() { }

  // Utilize getFieldValue to extract the boat name from the record wire
  get boatName() { }

  // Private
  subscription = null;

  // Subscribe to the message channel
  subscribeMC() {
    // local boatId must receive the recordId from the message
  }

  // Calls subscribeMC()
  connectedCallback() { }

  // Navigates to record page
  navigateToRecordViewPage() { }

  // Navigates back to the review list, and refreshes reviews component
  handleReviewCreated() { }
}
