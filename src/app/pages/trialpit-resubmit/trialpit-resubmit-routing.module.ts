import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrialpitResubmitPage } from './trialpit-resubmit.page';

const routes: Routes = [
  {
    path: '',
    component: TrialpitResubmitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrialpitResubmitPageRoutingModule {}
