import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeGoogleMapsProvider } from '../../providers/native-google-maps/native-google-maps';
import { centerProvider } from '../../providers/center-service';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the ParentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'near-by-list',
  templateUrl: 'near-by-list.html',
})
export class NearbylistPage {
  mapLists: any = [];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private _MapsProvider: NativeGoogleMapsProvider,
    private _storage: Storage,
    private _centerProvider: centerProvider
  ) {
  }

  ionViewDidLoad() {

    this._storage.get('centerId').then((centerId:any)=>{
      console.log('Map List');
      console.log(centerId);
      this._centerProvider.centerDashboardDetail(centerId).subscribe((centerDetail: any)=>{
          let latLng = {
            "latitude":parseFloat(centerDetail.data.data.center_lat),
            "longitude":parseFloat(centerDetail.data.data.center_long)
          };
          console.log(latLng);
          this._MapsProvider.centerMap(latLng).subscribe((centerMaps:any)=>{
            if(centerMaps.status){
              centerMaps.data.center_data.filter((centerMapData)=>{   
                  this.mapLists.push(centerMapData);
              });
              console.log(this.mapLists);
            }
          });

        }, error=>{
          console.log(error);
        });
      });


    // let latLng = {
    //   "latitude":42.743784000,
    //   "longitude":-83.379797000
    // };
    
    console.log('ionViewDidLoad ParentPage');
  }

}
