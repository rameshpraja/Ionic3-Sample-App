import { Component, ViewChild } from '@angular/core';
import {  App,Nav, Platform, MenuController, LoadingController, AlertController, ToastController, ViewController  } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Subject } from 'rxjs/Subject';

//import { LoginPage } from '../pages/login/login';
// import { DashboardPage } from '../pages/dashboard/dashboard';
import { LoginPage, MainPage } from '../pages/pages';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { Storage } from '@ionic/storage';
import { IonicApp } from 'ionic-angular';
import { Network } from '@ionic-native/network';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = '';
  activePage = new Subject();
  userData:any = {
    fname:"",
    email:""
  };

  parentPages: Array<{ title: string, component: any, active: boolean, icon: string}>;
  centerPages: Array<{ title: string, component: any, active: boolean, icon: string}>;
  rightMenuItems: Array<{ icon: string, active: boolean }>;
  placeholder = 'assets/imgs/avatar/devit-avatar.png';
  state: any;
  userRole: string = '';
  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    private auth: AuthServiceProvider,
    private storage: Storage,
    private alertCtrl: AlertController,
    private app: App,
    private toastCtrl: ToastController,
    private ionicApp: IonicApp,
    private network: Network
  ) {
    /** Start - Initialized App */
    platform.ready().then(() => {
      statusBar.styleDefault();
      if (splashScreen) {
        setTimeout(() => {
          splashScreen.hide();
        }, 100);
       }
      //splashScreen.hide();
      /** Start ready for Push Notification */
      
        // // watch network for a disconnect
        // let disconnectSubscription = this.network.onDisconnect().subscribe((data:string) => {
        //   console.log('network was disconnected :-(');
        //   alert('network was disconnected :-(');
        // });

        // // stop disconnect watch
        // disconnectSubscription.unsubscribe();


        // // watch network for a connection
        // let connectSubscription = this.network.onConnect().subscribe((data:string) => {
        //   console.log('network connected!');
        //   // We just got a connection but we need to wait briefly
        //   // before we determine the connection type. Might need to wait.
        //   // prior to doing any api requests as well.
        //   // setTimeout(() => {
        //   //   if (this.network.type === 'wifi') {
        //   //     alert('we got a wifi connection, woohoo!');
        //   //     console.log('we got a wifi connection, woohoo!');
        //   //   }
        //   // }, 3000);
        // });

        // // stop connect watch
        // connectSubscription.unsubscribe();

      
    });

    //Registration of push in Android and Windows Phone
    let lastTimeBackPress: number = 0;
    let timePeriodToExit: number = 2000;

    platform.registerBackButtonAction(() => {
        
        let checkMenuStatus = this.menuCtrl.isOpen();
        if(checkMenuStatus){
          this.menuCtrl.close();
        }else{
            // get current active page
            let viewComponentName: string = this.nav.getActive().component.name;
            if (viewComponentName == 'DashboardPage' || viewComponentName == 'LoginPage') {
                //Double check to exit app
                if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
                    platform.exitApp(); //Exit from app
                } else {
                    this.toastCtrl.create({
                        message: 'Press back again to exit the app',
                        duration: 3000,
                        position: 'bottom'
                    }).present().then().catch(() => {

                    });
                    lastTimeBackPress = new Date().getTime();
                }
            } else {
                // go to previous page
                this.nav.setRoot('DashboardPage');
                this.activePage.next(this.centerPages[0]);
            }
        }
    });
    /** End - Initialized App */

    //Start to update user's name and email in Drawer header
    this.auth.userData.subscribe((Data: any) => {
      //this.userData.fname = val;
      this.userData.fname = Data.first_name;
      this.userData.email = Data.email_address;
  });
    //End to update user's name and email in Drawer header

    /** Start - Parent Page Menu  */
    this.parentPages = [
      { title: 'Dashboard', component: 'DashboardPage', active: true, icon: 'home'},
      { title: 'Notification', component: 'NotificationPage', active: false, icon: 'notifications'},
      { title: 'Near By Location', component: 'NativeGoogleMapsPage', active: false, icon: 'pin'}
    ];

    this.activePage.subscribe((selectedPage: any) => {
      this.parentPages.map(page => {
        page.active = page.title === selectedPage.title;
      });
    });
    /** End - Parent Page Menu */

    /** Start - Center Page Menu  */
    this.centerPages = [
      { title: 'Dashboard', component: 'DashboardPage', active: true, icon: 'home'},
      { title: 'Parent List', component: 'ParentPage', active: false, icon: 'people'},
      { title: 'Near By Location', component: 'NativeGoogleMapsPage', active: false, icon: 'pin'}
    ];

    this.activePage.subscribe((selectedPage: any) => {
      this.centerPages.map(centerPage => {
        centerPage.active = centerPage.title === selectedPage.title;
      });
    });
    /** End - Center Page Menu  */

    /** Start : check if token exist show Main Page else Login page*/
    if(this.storage.get('centerToken')){
      this.storage.get('centerToken').then((val) => {
        console.log('center : '+ val );
        if (val == '' || val == null ) {
          console.log("center this key does not exists");
          this.storage.set('centerToken', '');
          
          this.storage.get('parentToken').then((parentVal) => {
            if (parentVal == '' || parentVal == null ) {
              console.log("parent this key does not exists");
              this.storage.set('parentToken', '');
              splashScreen.hide();
              this.rootPage = LoginPage;
            } else {
              splashScreen.hide();
              this.rootPage = MainPage;
            }
          });
          //this.rootPage = LoginPage;
        } else {
          splashScreen.hide();
          this.rootPage = MainPage;
        }
      });

    }else{
      this.storage.get('parentToken').then((val) => {
        console.log('parent : '+ val );
        if (val == '' || val == null ) {
          console.log("parent this key does not exists");
          this.storage.set('parentToken', '');
          splashScreen.hide();
          this.rootPage = LoginPage;
        } else {
          splashScreen.hide();
          this.rootPage = MainPage;
        }
      });

    }
   /** End : check if token exist show Main Page else Login page*/

  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    const loading = this.loadingCtrl.create();
    loading.present();
    if(page == 'logout'){
      loading.dismiss();
      
      if(this.storage.get('centerToken')){
        this.auth.logout('centerToken');
      }else{
        this.auth.logout('parentToken');
      }
      this.nav.setRoot(LoginPage);  
      this.activePage.next(this.centerPages[0]);

    }else{
      //this.menuCtrl.open();
      this.nav.setRoot(page.component);
      loading.dismiss();
      this.activePage.next(page);
    }
    
  }

  rightMenuClick(item) {
   // this.rightMenuItems.map(menuItem => menuItem.active = false);
   // item.active = true;
  }
  /** End - Sidebar Menu  */

}
