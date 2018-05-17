import { ElementRef, Injectable } from '@angular/core';
import {Http, Response,RequestOptions,Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import { Global } from '../../shared/global'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Storage } from '@ionic/storage';
import { MenuController } from 'ionic-angular';


@Injectable()
export class NativeGoogleMapsProvider {
  

  constructor(
    private http:Http,
    private storage: Storage,
    public menu: MenuController
    ) {}

    public centerMap(latLon):Observable<any[]>{
      let headers =new Headers();
      headers.append('Content-Type','application/json');
      return this.http.post(Global.BASE_CENTERMAP, latLon, {headers: headers})
        .map((response: Response) => {
              let centerMapData = response.json();
              return centerMapData;
          });
    }
  
}