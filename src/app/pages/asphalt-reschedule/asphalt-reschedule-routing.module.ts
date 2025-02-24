import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsphaltReschedulePage } from './asphalt-reschedule.page';

const routes: Routes = [
  {
    path: '',
    component: AsphaltReschedulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsphaltReschedulePageRoutingModule {}
