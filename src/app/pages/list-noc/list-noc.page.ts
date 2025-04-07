import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { debounceTime, distinctUntilChanged, finalize, Subject } from 'rxjs';
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
  encryptedUserType: any;
  userType: string | null;
  pageno: number = 1;
  totalPages: number = 1;
  isLoading: boolean = false;
  searchTerm: string = '';
  searchSubject: Subject<string> = new Subject<string>();
  isInfiniteScrollDisabled: boolean = false;
  constructor(
    private fb: FormBuilder,
    public router: Router,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private sharedService: SharedService,
    private nocService: NocService,
    private activatedRouteService: ActivatedRoute,
    
    private authService: AuthService

  ) { 
    this.userType = this.activatedRouteService.snapshot.paramMap.get('userType');
    console.log('User Type:', this.userType);
    this.searchSubject.pipe(
      debounceTime(500), // Wait for 500ms after user stops typing
      distinctUntilChanged() // Only emit if value has changed
    ).subscribe(searchValue => {
      this.searchTerm = searchValue;
      this.resetAndSearch();
    });
  }

  ngOnInit() {
    this.encryptuserType(this.userType);
  }

  encryptuserType(userType: any) {
    this.nocService.getEncryptedString(userType).pipe(finalize(() => {
    })).subscribe((res: any) => {
      console.log("ResEncrypted", res);
      
      if (res.status == 200 && res.success == true) {
        this.encryptedUserType = res.data;
        this.fetchNOCList(this.encryptedUserType, this.pageno,this.searchTerm);
      }
      else {
        this.loaderService.loadingDismiss();
        this.toastService.showError(res.message, "Error");
      }
    }, error => {
      this.loaderService.loadingDismiss();
      this.errorMsg = error;
      this.toastService.showError('Something went wrong', "Error");
    })
  }

  async fetchNOCList(userType: string, pageno: number, searchText: string = '') {
    await this.loaderService.loadingPresent();
    this.nocService.getNocs(userType,searchText, pageno).pipe(finalize(() => {
      this.loaderService.loadingDismiss();
    })).subscribe((res: any) => {
      console.log("Res", res);
      if (res.status == 200 && res.success == true) {
        // Assuming the API returns pagination metadata
        if (res.data && res.data.items) {
          if (pageno === 1) {
            this.nocList = res.data.items;
          } else {
            this.nocList = [...this.nocList, ...res.data.items];
          }
          
          // Update pagination info if available
          if (res.data.totalPages) {
            this.totalPages = res.data.totalPages;
          }
          
          // Disable infinite scroll if we're on the last page
          this.isInfiniteScrollDisabled = pageno >= this.totalPages || res.data.items.length === 0;
        }
      } else {
        this.toastService.showError('Fetch failed', 'Error');
        console.log('Fetch failed');
      }
    }, error => {
      this.loaderService.loadingDismiss();
      this.errorMsg = error;
      this.toastService.showError('Something went wrong', "Error");
    })
  }
  doRefresh(event: any) {
    console.log('Refreshing data...');

    // Simulate async data fetching
    setTimeout(() => {
      // Add new item or refresh your data
      this.fetchNOCList(this.encryptedUserType, this.pageno, this.searchTerm);

      // Complete the refresher animation
      event.target.complete();
      console.log('Refresh complete');
    }, 2000); // Simulate 2 seconds refresh time
  }
  navigateToDisplayPage(nocId : any) {
    if (nocId) {
      this.router.navigate(['/noc-details', nocId]);
    } else {
      console.warn('Please select a date and time first!');
    }
  }

  
  logout(){
    this.authService.logout();
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    console.log('scroll')
    if (this.isInfiniteScrollDisabled) {
      event.target.complete();
      return;
    }
    
    // Increment page number and fetch next page
    this.pageno++;
    
    this.nocService.getNocs(this.encryptedUserType,'', this.pageno)
      .pipe(finalize(() => {
        event.target.complete();
      }))
      .subscribe({
        next: (res) => {
          if (res.status == 200 && res.success == true && res.data.items) {
            // Add new items to the list
            this.nocList = [...this.nocList, ...res.data.items];
            
            // Disable infinite scroll if we're on the last page or no more items
            this.isInfiniteScrollDisabled = this.pageno >= this.totalPages || res.data.items.length === 0;
          } else {
            this.isInfiniteScrollDisabled = true;
          }
        },
        error: () => {
          this.isInfiniteScrollDisabled = true;
          this.toastService.showError('Failed to load more data', 'Error');
        }
      });
  }

  // Server-side search implementation
  onSearchChange(event: any) {
    const value = event.target.value;
    // Push the search value to the subject (will trigger the API call after debounce)
    this.searchSubject.next(value);
  }

  // Reset and search with new term
  resetAndSearch() {
    this.pageno = 1;
    this.nocList = [];
    this.isInfiniteScrollDisabled = false;
    this.fetchNOCList(this.encryptedUserType,this.pageno, this.searchTerm);
  }

  // Clear search
  clearSearch() {
    if (this.searchTerm !== '') {
      this.searchTerm = '';
      this.resetAndSearch();
    }
  }

}
