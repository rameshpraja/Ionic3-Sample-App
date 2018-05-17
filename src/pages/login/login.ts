import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, LoadingController, Loading, MenuController, Platform } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HttpErrorResponse } from '@angular/common/http';
import { Content } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  @ViewChild(Content) content: Content;
  loading: Loading;
  loginModel = { 
    username: '', 
    password: '' ,
    role_id : ''
  };
  loginErrorMessage : string = 'Please enter valid username and password';
  kidCare: any = ''; 
  // Property used to store the callback of the event handler to unsubscribe to it when leaving this page

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthServiceProvider,
    private alertCtrl: AlertController, 
    private loadingCtrl: LoadingController,
    public menuCtrl: MenuController,
    public platform: Platform
  ) {
    this.kidCare = 'Owner';
  }
  scrollToTop() {
    this.content.scrollToTop();
  }
  ionViewDidLoad() {
   
    this.menuCtrl.enable(false);
    console.log('ionViewDidLoad LoginPage');
  }
  
/** Start Center Login Function */
  public centerLogin() {
    this.loginModel.role_id = '2';
    if(this.loginModel.username == ""){
      this.showError('Please enter Username');
    }else if(this.loginModel.password == ""){
      this.showError('Please enter Password');
    }else{
      this.showLoading()
      this.auth.login(this.loginModel).subscribe((user: any) => {
        if (user.status) {
          this.navCtrl.setRoot('DashboardPage');
        } else {
          this.showError("Access Denied");
        }
      },
        (error:HttpErrorResponse) => {
          this.loading.dismiss();
          this.showError(this.loginErrorMessage);
          console.log(error);
          console.log("Error please check !! => " + error.status); 
        });
    }

   
  }
 /** End User Login Function */

 /** Start Center Login Function */
 public parentLogin() {
  this.loginModel.role_id = '3';
  if(this.loginModel.username == ""){
    this.showError('Please enter Username');
  }else if(this.loginModel.password == ""){
    this.showError('Please enter Password');
  }else{
    this.showLoading();
    this.auth.login(this.loginModel).subscribe((user:any) => {  
      if (user.status) { 
        this.navCtrl.setRoot('DashboardPage');
      } else {
        this.showError("Access Denied");
      }
    },
    (error:HttpErrorResponse) => {
        this.loading.dismiss();
        this.showError(this.loginErrorMessage);
        console.log("Error please check !! => " + error.status); 
      });
  }
 
}
/** End User Login Function */


  /** Start - Loading page function */
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'loading...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
 /** End - Loading page function */

 

 /** Start Show Error Alert function */
  showError(message) {
    //this.loading.dismiss();
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
/** End Show Error Alert function */
}
