import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompletedNocPageRoutingModule } from './completed-noc-routing.module';

import { CompletedNocPage } from './completed-noc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompletedNocPageRoutingModule
  ],
  declarations: [CompletedNocPage]
})
export class CompletedNocPageModule {}
