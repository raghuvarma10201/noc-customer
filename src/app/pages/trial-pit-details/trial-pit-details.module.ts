import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrialPitDetailsPageRoutingModule } from './trial-pit-details-routing.module';

import { TrialPitDetailsPage } from './trial-pit-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrialPitDetailsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [TrialPitDetailsPage],
  providers: [DatePipe]
})
export class TrialPitDetailsPageModule {}
