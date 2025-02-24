import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { NocService } from 'src/app/services/noc.service';
import { SharedService } from 'src/app/services/shared.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-list-noc',
  templateUrl: './list-noc.page.html',
  standalone: false,
  styleUrls: ['./list-noc.page.scss'],
})
export class ListNocPage implements OnInit {
  errorMsg: any;
  nocList: any = [];
  constructor(
    private fb: FormBuilder,
    public router: Router,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private sharedService: SharedService,
    private nocService: NocService,
    private activatedRouteService: ActivatedRoute
  ) { }

  ngOnInit() {
    this.fetchNOCList();
  }
  async fetchNOCList() {
    await this.loaderService.loadingPresent();
    this.nocService.getNocs().pipe(finalize(() => {
      this.loaderService.loadingDismiss();
    })).subscribe((res: any) => {
      console.log("Res", res);
      if(res.status == 200 && res.success == true){
        this.nocList = res.data;
        this.loaderService.loadingDismiss(); 
      }
      else {
        this.loaderService.loadingDismiss();
        this.toastService.showError(res.message, "Error");
      }
    }, error => {
      this.loaderService.loadingDismiss();
      this.errorMsg = error;
      this.toastService.showError(this.errorMsg, "Error");
    })
  }

  navigateToDisplayPage(nocId : any) {
    if (nocId) {
      this.router.navigate(['/noc-details', nocId]);
    } else {
      console.warn('Please select a date and time first!');
    }
  }
}
