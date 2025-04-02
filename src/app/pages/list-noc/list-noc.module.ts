import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListNocPageRoutingModule } from './list-noc-routing.module';

import { ListNocPage } from './list-noc.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListNocPageRoutingModule,
    TranslateModule
  ],
  declarations: [ListNocPage]
})
export class ListNocPageModule {}
