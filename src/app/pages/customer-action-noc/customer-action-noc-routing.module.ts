import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerActionNocPage } from './customer-action-noc.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerActionNocPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerActionNocPageRoutingModule {}
