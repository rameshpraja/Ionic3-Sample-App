import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { parentprovider } from '../../providers/parentprovider';


@IonicPage()
@Component({
  selector: 'page-child-activity',
  templateUrl: 'child-activity.html',
})
export class ChildActivityPage {
  childActivities: any = [];
  childActivyObj: any = {};
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private _parentprovider: parentprovider,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {

    this.childActivyObj = navParams.get("childrenActivities");
    console.log('this.childActivities');
    console.log(this.childActivyObj);
     

  }

  ionViewDidLoad() {
    //Start Get Parent Child Activities
    this._parentprovider.parentChildActivities().subscribe((parentChildActivitiesRes: any)=>{
      this.childActivities = parentChildActivitiesRes.data.data;
      console.log(this.childActivities);
    }, error=>{
      console.log(error);
      this.showError('Records not Found');
    });
    //End Get Parent Child Activities
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
