import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NocService {
  apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getNocs(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + "NOC/GetRequestNocDetails").pipe(catchError(this.handleError));
  }
  getTrialPitDetails(encryptedNocId : any): Observable<any> {
    const params = new HttpParams().set('nocId', encryptedNocId);
    return this.http.get<any>(environment.apiUrl + "Manager/NocAuditCommments",{ params }).pipe(catchError(this.handleError));
  }
  getNocDetails(encryptedNocId : any): Observable<any> {
    const params = new HttpParams().set('requestNocId', encryptedNocId);
    return this.http.get<any>(environment.apiUrl + "NOC/GetRequestNocDetailsById", { params }).pipe(catchError(this.handleError));
  }
  getEncryptedString(id : any): Observable<any> {
    const params = new HttpParams().set('encryptValue', id);
    return this.http.post<any>(environment.apiUrl + "Encryption/Encrypt", '',{ params }).pipe(catchError(this.handleError));
  }
  saveTrailPit(payload : any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "Customer/SaveTrailPitDetails", payload).pipe(catchError(this.handleError));
  }
  addComments(payload : any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "Manager/AddNOCRequestComment", payload).pipe(catchError(this.handleError));
  }
  rescheduleTrailPit(payload : any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "Customer/ChangeScheduleForTrailPit", payload).pipe(catchError(this.handleError));
  }
  saveAsphaltForm(payload : any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "Customer/SaveRoadCuttingDetails", payload).pipe(catchError(this.handleError));
  }
  async compressImage(imagePath: string, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imagePath;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        const maxWidth = 800; // Adjust max width
        const scaleSize = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scaleSize;
  
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
  
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject('Image compression failed');
          },
          'image/jpeg', // Output format
          quality // Compression quality (0.1 - 1)
        );
      };
      img.onerror = (error) => reject(error);
    });
  }

  uploadImage(blob: Blob,nocId : any) {
    const formData = new FormData();
    formData.append('image', blob, 'compressed-image.jpg');
    formData.append('nocId', nocId);
    return this.http.post<any>(environment.apiUrl + "Customer/SaveUploadImages", formData).pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;

    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;

    }
    return throwError(msg);
  }

}
