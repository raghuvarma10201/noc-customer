import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuildingInspectionReschedulePage } from './building-inspection-reschedule.page';

const routes: Routes = [
  {
    path: '',
    component: BuildingInspectionReschedulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuildingInspectionReschedulePageRoutingModule {}
