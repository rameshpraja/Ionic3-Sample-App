import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule }    from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MyApp } from './app.component';
//import { LoginPage } from '../pages/login/login';

// Provider
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { CameraProvider } from '../providers/util/camera.provider';
import { NativeGoogleMapsProvider } from '../providers/native-google-maps/native-google-maps';
import { DashboardProvider } from '../providers/dashboard';
import { parentprovider } from '../providers/parentprovider';
import { centerProvider } from '../providers/center-service';

// Ionic Nativ provider
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Push } from '@ionic-native/push';
import { Contacts } from '@ionic-native/contacts';  
import { Network } from '@ionic-native/network';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: true
    }),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    DashboardProvider,
    parentprovider,
    centerProvider,
    CameraProvider,
    Camera,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    NativeGoogleMapsProvider,
    Geolocation,
    GoogleMaps,
    SocialSharing,
    Push,
    Contacts,
    Network
  ]
})
export class AppModule {}
