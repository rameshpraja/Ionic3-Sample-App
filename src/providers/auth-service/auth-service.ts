import {Http, Response,RequestOptions,Headers} from '@angular/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Global } from '../../shared/global'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Subject } from 'rxjs/Subject';
import { Storage } from '@ionic/storage';
import { MenuController } from 'ionic-angular';

export interface User {
  username: string;
  password: string;
  role_id: number;
}

@Injectable()
export class AuthServiceProvider {
  public userData = new Subject();
  //currentUser: User;
  currentUser: string = '';
  headers: Headers;
  options: RequestOptions;
  activeMenu : string = '';
  constructor(
    private http:Http,
    private storage: Storage,
    public menu: MenuController,
  ) {}

  public login(data):Observable<User[]>{
    //this.currentUser.role_id = data.role_id;
    let headers =new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(Global.BASE_LOGIN, data, {headers: headers})
      .map((response: Response) => {
            let user = response.json();
           if(data.role_id == 1 || data.role_id == 2 ){ //Center User Token
            this.currentUser = 'center'
            this.storage.set('centerToken', user.data.data.token);
           }
           if(data.role_id == 3 ){ //Parent User Token
            this.currentUser = 'parent'
            this.storage.set('parentToken', user.data.data.token);
           }
           this.storage.set('user', user.data);
            return user;
        });
  }
  
  //Start to update user's name and email in Drawer header
  userDatafun(userData){
    this.userData.next(userData);
  }
  //End to update user's name and email in Drawer header

  logout(token){
    this.storage.remove(token).then(()=>{
      console.log('token is removed');
    });

    //this.storage.remove(token);
    //this.storage.remove('user');
    
    this.storage.remove('user').then(()=>{
      console.log('user is removed');
    });

    this.storage.remove('centerId').then(()=>{
      console.log('centerId is removed');
    });
    
    this.storage.clear().then(()=>{
      console.log('all keys are cleared');
    });
  }

  /** Start Menu Toggle Authentication */
  public menuAuthentication (){
    this.activeMenu = '';
    
    this.storage.get('parentToken').then(token=>{
      if(token){
        //alert('if parent');
        this.menu.enable(true, 'parentauthenticated');
        this.menu.enable(false, 'centerAuthenticated');
        this.activeMenu = 'parentauthenticated';
        //return this.activeMenu;
      }else{
        //alert('else center');
        this.menu.enable(true, 'centerAuthenticated');
        this.menu.enable(false, 'parentauthenticated');
        this.activeMenu = 'centerAuthenticated';
        //return this.activeMenu;
      }
      
    });
    return this.activeMenu;
  }
  /** End Menu Toggle Authentication */

  /** Start Parent Id Device Token */
  public parentDeviceToken (customerId, DeviceInfo):Observable<any>{
    console.log('DeviceInfo ' + customerId);
    
    console.log(DeviceInfo);
    let headers =new Headers();
    headers.append('Content-Type','application/json');
    return this.http.patch(Global.BASE_GET_DEVICE_TOKEN+customerId, DeviceInfo,  {headers: headers})
      .map((response: Response) => {
            return response.json();
        });
  }
  /** End Parent Id Device Token */

}
