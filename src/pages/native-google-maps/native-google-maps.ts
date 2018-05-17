import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, LoadingController } from 'ionic-angular';
import {
  CameraPosition,
  GoogleMap,
  GoogleMapOptions,
  GoogleMaps,
  GoogleMapsAnimation,
  GoogleMapsEvent,
  GoogleMapsMapTypeId,
  LatLng,
  Marker,
  MarkerOptions
} from '@ionic-native/google-maps';

import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
// import { NearbylistPage } from '../near-by-list/near-by-list';
// import { NearbymapPage } from '../near-by-map/near-by-map';

import { nearByListPage, nearByMapPage } from '../../pages/pages';
declare var google;

@IonicPage()
@Component({
  selector: 'page-native-google-maps',
  templateUrl: 'native-google-maps.html',
})
export class NativeGoogleMapsPage {
  nearByListPage = nearByListPage;
  //nearByMapPage = nearByMapPage;
  nearByMapPage : string = nearByMapPage;
//   @ViewChild('map') mapElement: ElementRef;
//   map:GoogleMap;
//   mapLists : any = '';
centerLocations: any = [];
centerData : any = {};
userRole  :string = '';
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public platform: Platform,
    private _googleMaps : GoogleMaps,
    public geolocation: Geolocation,
    private storage: Storage,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
  ) { }

// Load map only after view is initialized
  ngAfterViewInit() {}

  ionViewDidLoad() {

    /**Start Dashboard Chart Leads */
    this.storage.get('centerToken').then(token=>{
      if(token){
        this.userRole = 'center';
        this.storage.get('user').then((centerResult:any)=>{
          this.centerLocations = centerResult.data.user.centers;
          
          /** Start Check CenterId exist or not */
          this.storage.get('centerId').then((centerId:any)=>{
            if(centerId){
              this.centerData.centerId = centerId;
              this.centerLocations.map((centdata)=>{
                if(centerId == centdata.center_id){
                  this.centerData.centerName =  centdata.centers.name;
                }
              });
            }else{
              this.storage.set('centerId', this.centerLocations[0].center_id); // CenterId Storage 
              this.centerData.centerName = this.centerLocations[0].centers.name;
            }
          });
          /** End Check CenterId exist or not */
        });
  }else{
    this.userRole = 'parent';
  }
  });
    /**End Dashboard Chart Leads */
  }

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
          this.storage.set('centerId', locData.center_id);
          this.centerData.centerId = locData.center_id;
          this.centerData.centerName = locData.centers.name;
          const loading = this.loadingCtrl.create();
          loading.present();
          this.navCtrl.setRoot('NativeGoogleMapsPage');
          loading.dismiss();
          console.log('Radio Selected data:'+ locData.center_id);
        }
      }
    ]
  });
  alertBox.present();
}
/** End For Center Area Popup Dialog */

  
}
