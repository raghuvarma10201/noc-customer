import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrialPitDetailsPageRoutingModule } from './trial-pit-details-routing.module';

import { TrialPitDetailsPage } from './trial-pit-details.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrialPitDetailsPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [TrialPitDetailsPage],
  providers: [DatePipe]
})
export class TrialPitDetailsPageModule {}
