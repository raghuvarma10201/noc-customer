import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListNocPageRoutingModule } from './list-noc-routing.module';

import { ListNocPage } from './list-noc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListNocPageRoutingModule
  ],
  declarations: [ListNocPage]
})
export class ListNocPageModule {}
