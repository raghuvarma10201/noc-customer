import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuildingInspectionDetailsPage } from './building-inspection-details.page';

const routes: Routes = [
  {
    path: '',
    component: BuildingInspectionDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuildingInspectionDetailsPageRoutingModule {}
