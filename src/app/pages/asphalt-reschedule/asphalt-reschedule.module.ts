import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsphaltReschedulePageRoutingModule } from './asphalt-reschedule-routing.module';

import { AsphaltReschedulePage } from './asphalt-reschedule.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsphaltReschedulePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AsphaltReschedulePage]
})
export class AsphaltReschedulePageModule {}
