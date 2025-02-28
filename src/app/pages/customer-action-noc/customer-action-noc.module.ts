import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerActionNocPageRoutingModule } from './customer-action-noc-routing.module';

import { CustomerActionNocPage } from './customer-action-noc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerActionNocPageRoutingModule
  ],
  declarations: [CustomerActionNocPage]
})
export class CustomerActionNocPageModule {}
