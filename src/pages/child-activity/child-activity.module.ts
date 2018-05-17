import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChildActivityPage } from './child-activity';

@NgModule({
  declarations: [
    ChildActivityPage,
  ],
  imports: [
    IonicPageModule.forChild(ChildActivityPage),
  ],
})
export class ChildActivityPageModule {}
