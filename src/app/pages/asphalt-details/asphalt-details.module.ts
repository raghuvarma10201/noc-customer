import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsphaltDetailsPageRoutingModule } from './asphalt-details-routing.module';

import { AsphaltDetailsPage } from './asphalt-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsphaltDetailsPageRoutingModule
  ],
  declarations: [AsphaltDetailsPage]
})
export class AsphaltDetailsPageModule {}
