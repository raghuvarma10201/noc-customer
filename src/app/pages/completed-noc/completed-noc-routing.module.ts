import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompletedNocPage } from './completed-noc.page';

const routes: Routes = [
  {
    path: '',
    component: CompletedNocPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompletedNocPageRoutingModule {}
