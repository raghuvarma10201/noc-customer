import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UnderProcessListPageRoutingModule } from './under-process-list-routing.module';

import { UnderProcessListPage } from './under-process-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UnderProcessListPageRoutingModule
  ],
  declarations: [UnderProcessListPage]
})
export class UnderProcessListPageModule {}
