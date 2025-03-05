import { NgModule } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BuildingInspectionDetailsPageRoutingModule } from './building-inspection-details-routing.module';
import { BuildingInspectionDetailsPage } from './building-inspection-details.page';


// Factory function for loading translation files


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BuildingInspectionDetailsPageRoutingModule,
  ],
  declarations: [BuildingInspectionDetailsPage],
  providers: [DatePipe]
})
export class BuildingInspectionDetailsPageModule {}
