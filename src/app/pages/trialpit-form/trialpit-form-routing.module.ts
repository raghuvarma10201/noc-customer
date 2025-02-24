import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrialpitFormPage } from './trialpit-form.page';

const routes: Routes = [
  {
    path: '',
    component: TrialpitFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrialpitFormPageRoutingModule {}
