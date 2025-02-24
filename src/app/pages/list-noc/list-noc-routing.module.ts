import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListNocPage } from './list-noc.page';

const routes: Routes = [
  {
    path: '',
    component: ListNocPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListNocPageRoutingModule {}
