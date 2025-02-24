import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrialPitDetailsPage } from './trial-pit-details.page';

const routes: Routes = [
  {
    path: '',
    component: TrialPitDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrialPitDetailsPageRoutingModule {}
