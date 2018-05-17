import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NearbylistPage } from './near-by-list';

@NgModule({
  declarations: [
    NearbylistPage,
  ],
  imports: [
    IonicPageModule.forChild(NearbylistPage),
  ],
})
export class NearbylistPageModule {}
