import {Http, Response,RequestOptions,Headers} from '@angular/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Global } from '../shared/global';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Storage } from '@ionic/storage';
import { MenuController } from 'ionic-angular';

@Injectable()
export class centerProvider {
  headers: Headers;
  options: RequestOptions;
  activeMenu : string = '';
  constructor(
    private http:Http,
    private storage: Storage,
    public menu: MenuController,
  ) {}

  /** Start - Center Dashboard Picture Upload Service */
  public centerDashboardPicture(centerId, centerPictureData):Observable<any[]>{

    console.log('Global.BASE_CENTERPICTURE');
    console.log(centerPictureData);
    
    let headers =new Headers();
    headers.append('Content-Type','application/json');
    return this.http.patch(Global.BASE_CENTERPICTURE+centerId, centerPictureData, {headers: headers})
      .map((response: Response) => {
            let centerPicture = response.json();
            return centerPicture;
        });
  }
  /** End - Center Dashboard Picture Upload Service */

  /** Start - Center Dashboard Dropdown Service */
  public centerDashboardPopup():Observable<any[]>{
    let headers =new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(Global.BASE_CENTERPOPUP, {headers: headers})
      .map((response: Response) => {
            let centerPopupData = response.json();
            return centerPopupData;
        });
  }
  /** End - Center Dashboard Dropdown Service */

  /** Start - Center Dashboard Detail Service */
  public centerDashboardDetail(centerId):Observable<any[]>{
    // let headers =new Headers();
    return this.http.get(Global.BASE_CENTERPICTURE + centerId)
      .map((response: Response) => {
            let centerDashbordDetail = response.json();
            return centerDashbordDetail;
        });
  }
  /** End - Center Dashboard Detail Service */

   /** Start - Center Whether Detail Service */
   public centerDashboardWhetherDetail(CENTER_LNG,CENTER_LAT):Observable<any[]>{  
    return this.http.get(Global.BASE_CENTERWHETHER + "&lon=" + CENTER_LNG + "&lat=" + CENTER_LAT)
      .map((response: Response) => {
            let centerDashbordWhether = response.json();
            return centerDashbordWhether;
        });
  }
  /** End - Center Whether Detail Service */
}
