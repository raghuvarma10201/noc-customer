import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsphaltFormPage } from './asphalt-form.page';

const routes: Routes = [
  {
    path: '',
    component: AsphaltFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsphaltFormPageRoutingModule {}
