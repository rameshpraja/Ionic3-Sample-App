import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ParentPage } from './parent';

@NgModule({
  declarations: [
    ParentPage,
  ],
  imports: [
    IonicPageModule.forChild(ParentPage),
  ],
})
export class ParentPageModule {}
