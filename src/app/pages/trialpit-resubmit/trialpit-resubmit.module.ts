import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrialpitResubmitPageRoutingModule } from './trialpit-resubmit-routing.module';

import { TrialpitResubmitPage } from './trialpit-resubmit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrialpitResubmitPageRoutingModule
  ],
  declarations: [TrialpitResubmitPage]
})
export class TrialpitResubmitPageModule {}
