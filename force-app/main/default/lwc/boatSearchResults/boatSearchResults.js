import { api, LightningElement, track, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
// import  updateBoatList  from '@salesforce/apex/BoatDataService.updateBoatList';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
// ...
const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT = 'Ship it!';
const SUCCESS_VARIANT = 'success';
const ERROR_TITLE = 'Error';
const ERROR_VARIANT = 'error';


export default class BoatSearchResults extends LightningElement {
  selectedBoatId;
  columns = [];
  boatTypeId = '';
  @track boats;
  isLoading = false;
  rowOffset = 0;
  error = undefined;
  @track draftValues = [];
  
  //columns for boat editor datatable
  columns = [
    { label: 'Name', fieldName: 'Name', type: 'text', editable: 'true' },
    { label: 'Length', fieldName: 'Length__c', type: 'number', editable: 'true' },
    { label: 'Price', fieldName: 'Price__c', type: 'currency', editable: 'true' },
    { label: 'Description', fieldName: 'Description__c', type: 'text', editable: 'true' }
  ];

  // wired message context
  @wire(MessageContext)
  messageContext;
  
  // wired getBoats method 
  @wire(getBoats, { boatTypeId: '$boatTypeId' })
  wiredBoats(result) {
    this.boats = result;
    if (result.error) {
      this.error = result.error;
      this.boats = undefined;
    }
    this.isLoading = false;
    this.notifyLoading(this.isLoading);
  }

  // public function that updates the existing boatTypeId property
  // uses notifyLoading
  @api
  searchBoats(boatTypeId) {
    this.isLoading = true;
    this.notifyLoading(this.isLoading);
    this.boatTypeId = boatTypeId;
  }

  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  @api
  async refresh() {
    this.isLoading = true;
    this.notifyLoading(this.isLoading);
    await refreshApex(this.boats);
    this.isLoading = false;
    this.notifyLoading(this.isLoading);
  }

  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) {
    this.selectedBoatId = event.detail.boatId;
    console.log('click');
    this.sendMessageService(this.selectedBoatId);
  }

  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) {
    // explicitly pass boatId to the parameter recordId
    publish(this.messageContext, BOATMC, { recordId: boatId });
  }

  // The handleSave method must save the changes in the Boat Editor
  // passing the updated fields from draftValues to the 
  // Apex method updateBoatList(Object data).
  // Show a toast message with the title
  // clear lightning-datatable draft values
  handleSave(event) {
    // notify loading
    this.notifyLoading(true);
    // Update the records via Apex
    const recordInputs = event.detail.draftValues.slice().map(draft => {
      const fields = Object.assign({}, draft);
      return { fields };
    });

    // recordInputs.set('apiName', 'Boat__c');
    console.log(recordInputs);
    const promises = recordInputs.map(recordInput => {
      console.log('record input', recordInput)
      updateRecord(recordInput)
    });
    Promise.all(promises).then(() => {
      this.dispatchEvent(
        new ShowToastEvent({
          title: SUCCESS_TITLE,
          message: MESSAGE_SHIP_IT,
          variant: SUCCESS_VARIANT
        })
      );
      this.draftValues = [];
      return this.refresh();
    }).catch(error => {
      this.error = error;
      this.dispatchEvent(
        new ShowToastEvent({
          title: ERROR_TITLE,
          message: CONST_ERROR,
          variant: ERROR_VARIANT
        })
      );
      this.notifyLoading(false);
    }).finally(() => {
      this.draftValues = [];
    });
  }
  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) {
    if (isLoading) {
      this.dispatchEvent(new CustomEvent('loading'));
    } else {
      this.dispatchEvent(CustomEvent('doneloading'));
    }
  }
}
