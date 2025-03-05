import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuildingInspectionFormPage } from './building-inspection-form.page';

const routes: Routes = [
  {
    path: '',
    component: BuildingInspectionFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuildingInspectionFormPageRoutingModule {}
