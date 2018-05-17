import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpecialPage } from './special';

@NgModule({
  declarations: [
    SpecialPage,
  ],
  imports: [
    IonicPageModule.forChild(SpecialPage),
  ],
})
export class SpecialPageModule {}
