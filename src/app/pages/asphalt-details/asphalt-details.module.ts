import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsphaltDetailsPageRoutingModule } from './asphalt-details-routing.module';

import { AsphaltDetailsPage } from './asphalt-details.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsphaltDetailsPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [AsphaltDetailsPage],
  providers: [DatePipe]
})
export class AsphaltDetailsPageModule {}
