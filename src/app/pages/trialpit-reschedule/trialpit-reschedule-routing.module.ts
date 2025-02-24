import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrialpitReschedulePage } from './trialpit-reschedule.page';

const routes: Routes = [
  {
    path: '',
    component: TrialpitReschedulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrialpitReschedulePageRoutingModule {}
