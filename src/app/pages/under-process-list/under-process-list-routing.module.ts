import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnderProcessListPage } from './under-process-list.page';

const routes: Routes = [
  {
    path: '',
    component: UnderProcessListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnderProcessListPageRoutingModule {}
