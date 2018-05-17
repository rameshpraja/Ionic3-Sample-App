import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';

import {ParentPage} from '../parent/parent';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { SocialSharing } from '@ionic-native/social-sharing';
import { parentprovider } from '../../providers/parentprovider';
/**
 * Generated class for the ParentdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-parentdetail',
  templateUrl: 'parentdetail.html',
})
export class ParentdetailPage {
  parentDetails : any = [];
  sponsorsObj: any = {};
  
  childDetailImages = [
    "http://cebit2018angulardev.s3-website.ap-south-1.amazonaws.com/assets/img/baby.jpg",
    "http://cebit2018angulardev.s3-website.ap-south-1.amazonaws.com/assets/img/babycut.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJmg8k3yO7WTT535A1baI8mhtt7ynQ11Eo3jqWtFq_nTWup99M"
  ];
  notificationObj: any ={
    customer_id : null,
    title : "Cebit-2018 DevIT",
    description : "",
  }
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private socialSharing: SocialSharing,
    private contacts: Contacts,
    public alertCtrl: AlertController,
    private _parentlistprovider: parentprovider,
    public loadingCtrl: LoadingController,
    public platform: Platform
  ) {

    console.log('test const 2');
    console.log(navParams.get("childrenData"));
    this.notificationObj.customer_id =161;
    //this.notificationObj.customer_id = navParams.get("childrenData").id;
    console.log(this.notificationObj.customer_id);
    navParams.get("childrenData").childrens.filter((data: any)=>{
      var show = this.childDetailImages[Math.floor(Math.random() * this.childDetailImages.length)];
      let childrenDetails = {
        "firstname":data.first_name ,
        "dob":data.dob,
        "childImg":show
      }
      this.parentDetails.push(childrenDetails);
    });

    navParams.get("childrenData").sponsors.filter((sponsorData: any)=>{
      if(sponsorData.sponsor_type_id == 1){
        this.sponsorsObj.emailId =  sponsorData.email
        this.sponsorsObj.first_name =  sponsorData.first_name
        this.sponsorsObj.last_name =  sponsorData.last_name
        this.sponsorsObj.cell_phone =  sponsorData.cell_phone
        console.log('this.sponsorsObj.cell_phone');
        console.log(this.sponsorsObj.cell_phone);
        //this.sponsorsObj.cell_phone =  '+918000111384'
        //this.sponsorsObj.cell_phone =  '+918983377730'
      }
      
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ParentdetailPage');
  }

  //  For Send Notification
  notifications(event: Event) {
    event.stopPropagation();
  }

  // Start Add contact On Device 
  whatsapp(event: Event) {
    event.stopPropagation();
    let contact: Contact = this.contacts.create();
    contact.name = new ContactName(null, '', this.sponsorsObj.first_name + " "+ this.sponsorsObj.last_name);
    contact.phoneNumbers = [new ContactField('mobile', this.sponsorsObj.cell_phone)];
    contact.save().then(
    () => this.ShareDatawhatsapp(),
    
    (error: any) => alert("Error saving contact." + error.any)
    );
  }
  //End Add contact On Device 

  // Start Method share with whats App
  ShareDatawhatsapp(){
    this.socialSharing.shareViaWhatsAppToReceiver(this.sponsorsObj.cell_phone , "Hi Cebit" , "image" , "").then(()=>{
      //  alert("Success");
    },
    ()=>{
    //    alert("failed")
    })
  }
  // End For Share Whatsapp messanger

  // Start For Share with Mail
  mail(event: Event) {
    event.stopPropagation();
    // Check if sharing via email is supported
    this.socialSharing.canShareViaEmail().then(() => {
      // Share via email                 // Body    // Subject   // To Send
      this.socialSharing.shareViaEmail('Hi Cebit', 'CeBit', [this.sponsorsObj.emailId]).then(() => {
        // Success!
        }).catch(() => {
        // Error!
        });
    }).catch(() => {
      // Sharing via email is not possible
    });
  }
  // End For Share with Mail

  /** Start Notification Prompt Box */
  notificationPromptBox(){
    console.log('alert box');
    let prompt = this.alertCtrl.create({
      title: 'Notification',
      message: "share Event activity for child",
      inputs: [
        {
          name: 'message',
          placeholder: 'Message',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Send',
          handler: data => {
            console.log('Saved clicked');
            console.log(data);
              if (!data.message) {
                alert('Please enter Message');
                return false;
            } else {
                //make HTTP call
                this.notificationObj.description = data.message;
                this._parentlistprovider.parentDetailNotification(this.notificationObj).subscribe((notificationData: any)=>{
                if(notificationData.status){
                    this.showSuccess(notificationData.data.message);
                }
              }, error=>{
                  console.log(error);
                  this.showError('something went wrong');
              });
            }
          }
        }
      ]
    });
    prompt.present();


    
  }
  /** End Notification Prompt Box */

  /** Start Show Error Alert function */
  showError(message) {
    const loading = this.loadingCtrl.create();
    loading.dismiss();
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
  /** End Show Error Alert function */

  /** Start Show Error Alert function */
  showSuccess(message) {
    const loading = this.loadingCtrl.create();
    loading.dismiss();
    let alert = this.alertCtrl.create({
      title: 'Success',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
  /** End Show Error Alert function */

}
