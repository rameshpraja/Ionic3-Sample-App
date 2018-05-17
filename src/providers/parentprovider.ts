import {Http, Response,RequestOptions,Headers} from '@angular/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Global } from '../shared/global';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Storage } from '@ionic/storage';
import { MenuController } from 'ionic-angular';

@Injectable()
export class parentprovider {
  headers: Headers;
  options: RequestOptions;
  activeMenu : string = '';
  constructor(
    private http:Http,
    private storage: Storage,
    public menu: MenuController,
  ) {}

  public centerParentlist(parentData):Observable<any[]>{
    
    let headers =new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(Global.BASE_PARENTLIST, parentData, {headers: headers})
      .map((response: Response) => {
            let parentlist = response.json();
            return parentlist;
        });
  }

  /** Start Parent Child Details */
  public parentChildDetails(customerId):Observable<any[]>{
    let Data = {"id":"","pagesize":-1,"where":{"customer_id":{"$eq":customerId}}}
    let headers =new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(Global.BASE_GET_PARENT_CHILD_DETAILS, Data, {headers: headers})
      .map((response: Response) => {
            let childDetails = response.json();
            return childDetails;
        });
  }
  /** End Parent Child Details */

  /** Start Parent Child Activities */
  public parentChildActivities():Observable<any[]>{
    let headers =new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(Global.BASE_GET_PARENT_CHILD_ACTIVITY, {headers: headers})
      .map((response: Response) => {
            let childActivities = response.json();
            return childActivities;
        });
  }
  /** End Parent Child Activities */

  /** Start Parent List Notification */
  public parentNotification(customerId):Observable<any[]>{
    let data = {
      "order":"-id",
      "where" : {
       "customer_id":customerId,
      },
      
     }
    let headers =new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(Global.BASE_GET_PARENT_NOTIFICATION, data, {headers: headers})
      .map((response: Response) => {
            let parentNotifications = response.json();
            return parentNotifications;
        });
  }
  /** End Parent List  Notification */


  /** Start Parent List Notification */
  public parentDetailNotification(notificationParams):Observable<any[]>{
    
    let headers =new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(Global.BASE_GET_PARENT_DETAIL_NOTIFICATION, notificationParams, {headers: headers})
      .map((response: Response) => {
            let parentDetailNotifications = response.json();
            return parentDetailNotifications;
        });
  }
  /** End Parent List  Notification */


}
