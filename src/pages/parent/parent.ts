import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform,LoadingController,AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { DashboardProvider } from '../../providers/dashboard';
import { parentprovider } from '../../providers/parentprovider';
import { centerProvider } from '../../providers/center-service';
import { Storage } from '@ionic/storage';
import { MainPage } from '../pages';
/**
 * Generated class for the ParentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-parent',
  templateUrl: 'parent.html',
})
export class ParentPage {
  parentLists : any = [];
  parentData: any = {
    pageTitle: "Families",
    page:"1",
    pagesize:"10",
    total:"0",
    order:"-id",
    center_id:"",
    where:{
      center_id:""
    }
  };
  centerLocations: any = [];
  centerData : any = {};
  sponsorTypeIdStatus : any;

  notificationObj: any ={
    center_id : null,
    title : "Cebit-2018 DevIT",
    description : "",
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthServiceProvider,
    private _parentlistprovider: parentprovider,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private _storage: Storage,
    private _centerProvider: centerProvider
    ) {

     
          /** Start Menu Toggle Authentication */
      //  this.activeMenu = this.auth.menuAuthentication();
        /** End Menu Toggle Authentication */
        // let backAction =  platform.registerBackButtonAction(() => {
        //   console.log("second");
        //   this.navCtrl.pop();
        //   backAction();
        // },2)

  }

  
  ionViewDidLoad() {
    /** Start get centerLocations from user Storage */
    this._storage.get('user').then((centerResult:any)=>{
      this.centerLocations = centerResult.data.user.centers;
        /** Start get centerId from Storage */
        this._storage.get('centerId').then((centerId:any)=>{
          if(centerId){
              this.centerData.centerId = centerId;
              this.notificationObj.center_id = centerId;
              //getCenterParentList();
              this.parentData.center_id = centerId;
              this.parentData.where.center_id = centerId;
              /** Start parentList API */
              this._parentlistprovider.centerParentlist(this.parentData).subscribe((ParentListData: any)=>{
                if(ParentListData.data.data.length <= 0){
                  this.showError('Parent List not exist');
                  this.parentLists = [];
                }else{
                  ParentListData.data.data.filter((parentListData)=>{
                    parentListData.sponsors.map((res)=>{
                      this.sponsorTypeIdStatus = res.sponsor_type_id;
                    });
                    this.parentLists.push(parentListData);
                  });
                }
                
              }, error=>{
                  console.log(error);
                  this.showError('Records not Found');
              });
              /** End parentList API */
          }else{
            this.showError('Center Id not exist');
          }
          
        });
        /** End get centerId from Storage */
      });
    /** End get centerLocations from user Storage */
  }

  /** Start Navigate to parentDetail Page */
  navigateToParentDetail(list){
    this.navCtrl.push('ParentdetailPage', {
        'childrenData':  list       
      });
  }
  /** End Navigate to parentDetail Page */

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

  /** Start For Center Area Popup Dialog */
centerLocationBox() {
  let centerLocations = [];
  this.centerLocations.filter(locData=>{
    let centerLoc = {      
        type: 'radio',
        label: locData.centers.name,
        value: locData,
       checked: (this.centerData.centerId == locData.center_id)? true : false
      }
    centerLocations.push(centerLoc);
  });
  
  let alertBox = this.alertCtrl.create({
    title: 'Select Center Location',
    inputs: centerLocations,
    buttons : [
      {
        text: 'Cancel'
      },
      {
        text: 'Ok',
        handler: (locData: any) => {
          console.log('locData');
          console.log(locData);
          this._storage.set('centerId', locData.center_id);
          this.centerData.centerId = locData.center_id;
          this.centerData.centerName = locData.centers.name;
          const loading = this.loadingCtrl.create();
          loading.present();
          //this.navCtrl.setRoot('NativeGoogleMapsPage');
          this.ionViewDidLoad();
          loading.dismiss();
          console.log('Radio Selected data:'+ locData.center_id);
        }
      }
    ]
  });
  alertBox.present();
}
/** End For Center Area Popup Dialog */


/** Start Notification Prompt Box */
notificationPromptBox(){
  console.log('alert box');
  let prompt = this.alertCtrl.create({
    title: 'Notification',
    message: "share Event activity for child",
    inputs: [
      {
        name: 'message',
        placeholder: 'Message'
      },
    ],
    buttons: [
      {
        text: 'Cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
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

    public generateUserIcon(nameCharacter: string): { [name: string]: string } {
      let colorArr: string[] = [
          '#51b8a3',
          '#5abd53',
          '#1866fa',
          '#c63926',
          '#f17a30',
          '#9754fc',
          '#641E16',
          '#641E16',
          '#512E5F',
          '#4A235A',
          '#154360',
          '#1B4F72',
          '#117864',
          '#0B5345',
          '#145A32',
          '#186A3B',
          '#7D6608',
          '#7E5109',
          '#6E2C00',
          '#4D5656',
          '#1B2631',
          '#17202A'
      ];
      let charASCCI: number = nameCharacter.charCodeAt(0);
      let mod: number = charASCCI % colorArr.length;

      //let k = colorArr[Math.floor(Math.random() * colorArr.length)];
      let profilePictureStyle: { [name: string]: string } = {
          'border': '1px solid ' + colorArr[mod],
          'background': colorArr[mod]
      };

      return profilePictureStyle;
    }

}
