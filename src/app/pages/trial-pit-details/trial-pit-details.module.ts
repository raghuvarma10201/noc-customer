import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrialPitDetailsPageRoutingModule } from './trial-pit-details-routing.module';

import { TrialPitDetailsPage } from './trial-pit-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrialPitDetailsPageRoutingModule
  ],
  declarations: [TrialPitDetailsPage]
})
export class TrialPitDetailsPageModule {}
