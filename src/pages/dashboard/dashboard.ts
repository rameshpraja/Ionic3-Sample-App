import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController,Platform, NavParams, ActionSheetController, LoadingController,MenuController, AlertController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { CameraProvider } from '../../providers/util/camera.provider';
import { Storage } from '@ionic/storage';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
/** Start Provider */
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { DashboardProvider } from '../../providers/dashboard';
import { centerProvider } from '../../providers/center-service';
import { parentprovider } from '../../providers/parentprovider';
import { Network } from '@ionic-native/network';


/** End Provider */
@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {
  @ViewChild('barCanvas') barCanvas;  

  placeholder: string = 'assets/imgs/imgs/mario.jpg';
  chosenPicture: any;
  activeMenu: string;
  barChart: any;
  centerId : any = '';
  //chartMonths : any = [];
  //chartLeadsCount : any = [];
  centerPictures : any = {
    image:"",
    id: 35
  };
  userRole  : string = '';
  centerData : any = {};
  centerLocations: any = [];
  DashboardWhether: any = {};
  parentData = {
    centerId: ''
  };

  childDetails: any = [];
  childDetailImages = [
    "http://cebit2018angulardev.s3-website.ap-south-1.amazonaws.com/assets/img/baby.jpg",
    "http://cebit2018angulardev.s3-website.ap-south-1.amazonaws.com/assets/img/babycut.jpg",
    "http://cebit2018angulardev.s3-website.ap-south-1.amazonaws.com/assets/img/babycut.jpg"
  ];
  deviceType:string = '';
  constructor(
      public navCtrl: NavController,
      public actionsheetCtrl: ActionSheetController,
      public cameraProvider: CameraProvider,
      public platform: Platform,
      public loadingCtrl: LoadingController,
      private alertCtrl: AlertController, 
      public menu: MenuController,
      private storage: Storage,
      private auth: AuthServiceProvider,
      private _dashboardProvider: DashboardProvider,
      private _centerProvider: centerProvider,
      private _parentprovider: parentprovider,
      private push: Push,
      private network: Network

    ) {
      console.log('test');
      if(platform.is('android')) {
        this.deviceType = 'android';
      }else if(platform.is('ios')){
        this.deviceType = 'ios';
      }else{
        this.deviceType = '';
      }
      console.log(platform.is('android'));
      console.log(platform.is('ios'));
      console.log('end test');
      /** Start Menu Toggle Authentication */
      this.activeMenu = this.auth.menuAuthentication(); 
      /** End Menu Toggle Authentication */
      //
      
      platform.ready().then(() => {
        
        console.log('init');

          /**Start user Verify Center or Parent */
          this.storage.get('parentToken').then(token=>{
            if(token){ // parent user Details
                this.userRole = 'parent';
                this.storage.get('user').then((parentResult:any)=>{
                    
                  /** Start ready for Push Notification */
                  this.initPushNotification(parentResult.data.user.customer[0].id);
                  /** End ready for Push Notification */

                  this.auth.userDatafun(parentResult.data.user); // Side Menu user name & Email
                  //Start Get Parent Center ID
                  this._dashboardProvider.getParentCenterId(parentResult.data.user.customer[0].id).subscribe((parentDashboardRes: any)=>{
                      this.parentData.centerId = parentDashboardRes.data.data.center_id;
                      this.storage.set('centerId', parentDashboardRes.data.data.center_id); // CenterId Storage 
                      this.getCenterDetail(this.parentData.centerId); // For Wheather API Function
                  }, error=>{
                      console.log(error);
                      this.showError('Records not Found');
                  });
                  //End Get Parent Center ID

                  //Start Get Parent Child Details
                  this._parentprovider.parentChildDetails(parentResult.data.user.customer[0].id).subscribe((parentChildDetailsRes: any)=>{
                    parentChildDetailsRes.data.data.filter((childDetails)=>{
                      var show = this.childDetailImages[Math.floor(Math.random() * this.childDetailImages.length)];
                        let childrenDetails = {
                          "firstname":childDetails.first_name,
                          "dob":childDetails.dob,
                          "childImg":show
                        }
                        this.childDetails.push(childrenDetails);
                    });

                  }, error=>{
                    console.log(error);
                    this.showError('Records not Found');
                  });
                  //End Get Parent Child Details
                });

            }else{ // Center user Details
              this.userRole = 'center';
                this.storage.get('user').then((centerResult:any)=>{
                this.auth.userDatafun(centerResult.data.user);
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
                    this.centerDashboardChartLeads(centerId); 
                    this.getCenterDetail(centerId);
                  }else{
                    this.storage.set('centerId', this.centerLocations[0].center_id); // CenterId Storage 
                    this.centerData.centerId = this.centerLocations[0].center_id;
                    this.centerData.centerName = this.centerLocations[0].centers.name;
                    this.centerDashboardChartLeads(this.centerLocations[0].center_id); 
                    this.getCenterDetail(this.centerLocations[0].center_id);
                  }
                });
                /** End Check CenterId exist or not */
              });

            }
          });
          /**End user Verify Center or Parent */
      });
      /** End  platform ready */
    }

ionViewDidLoad() {
  console.log('view did load');
    
}

/** Start Center DashBoard Detail API */
getCenterDetail(centerId){
  this._centerProvider.centerDashboardDetail(centerId).subscribe((DeshBoardDetail: any)=>{
    if(DeshBoardDetail.status){
      this.chosenPicture = DeshBoardDetail.data.data.center_image;
      /** Function Api call To get whether Api from lat-lng **/   
      this.getWhetherDetail(DeshBoardDetail.data.data.center_lat,DeshBoardDetail.data.data.center_long);
    }else{
      this.showError('Center Image not found');
    }
    
  }, error=>{
      console.log(error);
      this.showError('Records not Found');
  });
}
/** End Center DashBoard Detail API */

 /** Start Api call To get whether Api fro m lat-lng **/   
 getWhetherDetail(center_lat,center_long){
    this._centerProvider.centerDashboardWhetherDetail(center_long,center_lat).subscribe((DeshBoardWhetherRes: any)=>{
      //setTimeout(()=>{
        this.DashboardWhether = DeshBoardWhetherRes;
      //},300);
    }, error=>{
        console.log(error);
        this.showError('Records not Found');
    });
  }
 /** End Api call To get whether Api **/   

  /** Start Dashboard Center Chart Leads */
  centerDashboardChartLeads(centerId){
    let chartMonths = [];
    let chartLeadsCount = [];
    this._dashboardProvider.centerDashboardChart(centerId).subscribe((DashbordChart:any)=>{
      if(DashbordChart.data.lead_data.length > 0){
        DashbordChart.data.lead_data.filter((chartRes)=>{
          chartMonths.push(chartRes.month);
          chartLeadsCount.push(chartRes.leads_count);
          
          /** Start : Bar Chart */
          this.barChart = new Chart(this.barCanvas.nativeElement, {
            type: 'bar',
            data: {
                labels: chartMonths,
                datasets: [{
                    label: '# of Leads',
                    data: chartLeadsCount,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
          });
        /** End : Bar Chart */

        });
        
      }else{
        /** Start : Bar Chart */
        this.barChart = new Chart(this.barCanvas.nativeElement, {
          type: 'bar',
          data: {
              labels: chartMonths,
              datasets: [{
                  label: 'Leads not available',
                  data: chartLeadsCount,
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)'
                  ],
                  borderColor: [
                      'rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)'
                  ],
                  borderWidth: 1
              }]
          },
          options: {
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero:true
                      }
                  }]
              }
          }
        });
            /** End : Bar Chart */
      }
      
       }, error=>{
           console.log(error);
     });
  }
  /** End Dashboard Center Chart Leads */

  /** Start Ionic Camera */
  changePicture() {
    const actionsheet = this.actionsheetCtrl.create({
      title: 'upload picture',
      buttons: [
        {
          text: 'camera',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: !this.platform.is('ios') ? 'gallery' : 'camera roll',
          icon: !this.platform.is('ios') ? 'image' : null,
          handler: () => {
            this.getPicture();
          }
        },
        {
          text: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          role: 'destructive',
          handler: () => {
            console.log('the user has cancelled the interaction.');
          }
        }
      ]
    });
    return actionsheet.present();
  }

  takePicture() {
    const loading = this.loadingCtrl.create();
    loading.present();
    return this.cameraProvider.getPictureFromCamera().then(picture => {
      if (picture) {
        this.chosenPicture = picture;
        this.centerData.image = picture;
        this.centerPictures.image = picture;
        this._centerProvider.centerDashboardPicture(this.centerData.centerId, this.centerData).subscribe((centerImgData: any)=>{
          if(!centerImgData.status){
            this.showError('Somthing Went Wrong on Server');
            this.chosenPicture = '';
          } 
        },error=>{
          this.showError('show_error_'+ error);
        });
      }
      loading.dismiss();
    }, error => {
      alert(error);
    });
  }

  getPicture() {
    const loading = this.loadingCtrl.create();
    loading.present();
    return this.cameraProvider.getPictureFromPhotoLibrary().then(picture => {
      if (picture) {
        this.chosenPicture = picture;
        this.centerData.image = this.chosenPicture;
        this.centerPictures.image = this.chosenPicture;
        this._centerProvider.centerDashboardPicture(this.centerData.centerId, this.centerData.image).subscribe((centerImgData: any)=>{
          if(!centerImgData.status){
            this.showError('Somthing Went Wrong on Server');
            this.chosenPicture = '';
          }

        },error=>{
          this.showError('show_error_'+ error);
        });
      }
      loading.dismiss();
    }, error => {
      alert(error);
    });
  }
/** End Ionic Camera */

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
          this.centerDashboardChartLeads(locData.center_id);
          this.getCenterDetail(locData.center_id);
          loading.dismiss();
        }
      }
    ]
  });
  alertBox.present();
}
/** End For Center Area Popup Dialog */

/**Start Push Notification when parent logged in */
initPushNotification(customerId) {
  console.log('init notification');
  if (!this.platform.is('cordova')) {
    console.warn('Push notifications not initialized. Cordova is not available - Run in physical device');
    return;
  }
  const options: PushOptions = {
    android: {
      senderID: '359285562460'
    },
    ios: {
      alert: 'true',
      badge: false,
      sound: 'true'
    },
    windows: {}
  };
  const pushObject: PushObject = this.push.init(options);

  pushObject.on('registration').subscribe((data: any) => {
    let DeviceInfo = {
      "device_type" : this.deviceType,
      "device_token" : data.registrationId
    }
    this.auth.parentDeviceToken(customerId, DeviceInfo).subscribe((DeviceResp)=>{
        // console.log('Deviceres');
        // console.log(DeviceResp);
    });
    //TODO - send device token to server
  });

  pushObject.on('notification').subscribe((data: any) => {
    
    console.log('message -> ');
    console.log(data);
    let notificationData = "<b>"+data.title + "</b><br/>" + data.additionalData.description;
    console.log('notificationData 1');
    console.log(notificationData);
    //if user using app and push notification comes
    if (data.additionalData.foreground) {
      // if application open, show popup
      let confirmAlert = this.alertCtrl.create({
        title: 'New Notification',
        message: notificationData,
        buttons: [{
          text: 'Ignore',
          role: 'cancel'
        }, {
          text: 'View',
          handler: () => {
            //TODO: Your logic here
            //this.navCtrl.push(DetailsPage, { message: data.message });
            console.log('notificationData');
            console.log(notificationData);
          }
        }]
      });
      confirmAlert.present();
    } else {
      //if user NOT using app and push notification comes
      //TODO: Your logic on click of push notification directly
      //this.navCtrl.push(DetailsPage, { message: data.message });
      console.log('Push notification clicked');
    }
  });

  pushObject.on('error').subscribe(error => console.error('Error with Push plugin' + error));
}
/**End Push Notification when parent logged in  */

/** Start Child Activities */
childActivities(activities){
  this.navCtrl.push('ChildActivityPage', {
    'childrenActivities':  activities
  });
}
/** End Child Activities */

/** Start - Loading page function */
showLoading() {
  const loading = this.loadingCtrl.create({
    content: 'loading...',
    dismissOnPageChange: true
  });
  loading.present();
}
/** End - Loading page function */

}
