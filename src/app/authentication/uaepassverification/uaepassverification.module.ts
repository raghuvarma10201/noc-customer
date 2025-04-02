import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UaepassverificationPageRoutingModule } from './uaepassverification-routing.module';

import { UaepassverificationPage } from './uaepassverification.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UaepassverificationPageRoutingModule,
    TranslateModule
  ],
  declarations: [UaepassverificationPage]
})
export class UaepassverificationPageModule {}
