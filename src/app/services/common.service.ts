import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getDefaultSettings(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + "Customer/GetConfigSettings").pipe(catchError(this.handleError));
  }

  getDadhboardCounts(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + "Manager/GetDashBoardDetails").pipe(catchError(this.handleError));
  }

  getDocumentslist(id: any): Observable<any> {
    const params = new HttpParams().set('nocid', id);
    return this.http.get<any>(environment.apiUrl + "NOC/NocCustomerActionDocList", {params}).pipe(catchError(this.handleError));
  }

  changeScheduleForTrailPit(body: any){
    return this.http.post<any>(environment.apiUrl + "Customer/ChangeScheduleForTrailPit", body).pipe(catchError(this.handleError));
  }

  acceptTrailPitOrRoadCutting(body: any){
    return this.http.post<any>(environment.apiUrl + "Customer/AcceptTrailPitOrRoadCutting", body).pipe(catchError(this.handleError));
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
