import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { LoaderService } from 'src/app/services/loader.service';
import { NocService } from 'src/app/services/noc.service';
import { SharedService } from 'src/app/services/shared.service';
import { ToastService } from 'src/app/services/toast.service';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  standalone: false,
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  id: string | null = null;

  nocDetails: any;
  encryptedNocId: string = '';
  errorMsg: any;
  isTrailPitEnabled: boolean = false;
  isAsphaltEnabled: boolean = false;
  nocStatus: string = '';
  documentslist: any;
  baseUrl = environment.imgUrl;
  constructor(
    private fb: FormBuilder,
    public router: Router,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private sharedService: SharedService,
    private nocService: NocService,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private http: HttpClient,
    private platform: Platform
  ) {
    
  }

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.id = params.get('id');
      console.log('Updated ID:', this.id);
      await this.loaderService.loadingPresent();
      this.nocService.getEncryptedString(params.get('id')).pipe(finalize(() => {
        this.loaderService.loadingDismiss();
      })).subscribe((res: any) => {
        console.log("ResEncrypted", res);
        
        if (res.status == 200 && res.success == true) {
          this.fetchNOCDetails(res.data);
          this.getDocumentList(res.data);
          this.encryptedNocId = res.data;
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
      //this.fetchNOCDetails();
    });
  }
  async fetchNOCDetails(encryptedNocId : any) {
    await this.loaderService.loadingPresent();
    this.nocService.getNocDetails(encryptedNocId).pipe(finalize(() => {
      this.loaderService.loadingDismiss();
    })).subscribe((res: any) => {
      console.log("Res", res);
      if (res.status == 200 && res.success == true) {
        this.nocDetails = res.data;
        this.nocStatus = res.data.nocStatus;
        const arr = res.data.customerActionId.split(",");
        console.log("arr",arr);
        if(res.data.nocStatusId == 4){
          if(arr.includes("2")){
            this.isTrailPitEnabled = true;
          }
          if(arr.includes("3")){
            this.isAsphaltEnabled = true;
          }
        }
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
  navigateToTraiPitForm(nocData : any) {
    if (nocData) {
      nocData.customerActionId = 2;
      this.router.navigate(['/trialpit-form'], { state: { nocData: nocData, encryptedNocId : this.encryptedNocId } });
    } else {
      console.warn('Please select a date and time first!');
    }
  }
  navigateToTraiPitDetails(nocData : any) {
    if (nocData) {
      nocData.customerActionId = 2;
      this.router.navigate(['/trial-pit-details'], { state: { nocData: nocData, encryptedNocId : this.encryptedNocId } });
    } else {
      console.warn('Please select a date and time first!');
    }
  }
  navigateToAsphaltForm(nocData : any) {
    if (nocData) {
      nocData.customerActionId = 3;
      this.router.navigate(['/asphalt-form'], { state: { nocData: nocData, encryptedNocId : this.encryptedNocId } });
    } else {
      console.warn('Please select a date and time first!');
    }
  }
  navigateToAsphaltDetails(nocData : any) {
    if (nocData) {
      nocData.customerActionId = 2;
      this.router.navigate(['/asphalt-details'], { state: { nocData: nocData, encryptedNocId : this.encryptedNocId } });
    } else {
      console.warn('Please select a date and time first!');
    }
  }

  getDocumentList(encryptedNocId: any) {
    this.commonService.getDocumentslist(encryptedNocId).subscribe((res: any) => {
      console.log("ResDoc", res);
      if (res.status == 200 && res.success == true) {
        console.log("documents response", res.data);
        this.documentslist = res.data;
      }
      else {
        this.toastService.showError(res.message, "Error");
      }
    }
    );
  }

  async downloadFile(doc: any) {
    const fileUrl = `${this.baseUrl}${doc.approvedFilePath}`;
    const fileName = doc.approveFilename;

    try {
      // Fetch file as blob
      const response: any = await this.http.get(fileUrl, { responseType: 'blob' }).toPromise();

      if (this.platform.is('android') || this.platform.is('ios')) {
        // Mobile: Save file to device storage
        const base64Data = await this.convertBlobToBase64(response);
        await Filesystem.writeFile({
          path: fileName,
          data: base64Data as string,
          directory: Directory.Documents
        });

        this.toastService.showSuccess('Download successful! Check your Files app.','');
      } else {
        // Web: Trigger browser download
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Download failed:', error);
      this.toastService.showError('Failed to download file.','');
    }
  }

  private convertBlobToBase64(blob: Blob): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };
}
