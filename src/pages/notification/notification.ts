import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { parentprovider } from '../../providers/parentprovider';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  notificationListData : any = [];

  itemSelected(item: string) {
  console.log("Selected Item", item);
}

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private _parentprovider: parentprovider,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private _storage: Storage
  ) {
  }

  ionViewDidLoad() {

    this._storage.get('user').then((parentResult:any)=>{ //get parent custmoer Id
      this._parentprovider.parentNotification(parentResult.data.user.customer[0].id).subscribe((notificationRes: any)=>{ //return parent Notification List
        if(notificationRes.data.data.length > 0){
          notificationRes.data.data.filter((data)=>{

            let notificationObj = {
              "title" : data.title,
              "description" : data.description,
              "dateCreated" : data.created_at
            }
            this.notificationListData.push(notificationObj);
          });
  
        }else{
          this.showError('Records not Found');
        }
        
       });
      
    });
   
  }

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

}
