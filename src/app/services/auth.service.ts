import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SharedService } from './shared.service';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl:string=environment.apiUrl;
  isloggedIn:boolean=false;
  userData:any;
  
  constructor(private http: HttpClient,  
    public router: Router,
    public sharedService: SharedService,
     ) { }
  // Method to check if user is authenticated (you could use real authentication logic here)
  isAuthenticated(): Observable<boolean> {
    // Replace this logic with actual authentication status checking
    const isLoggedIn = !!localStorage.getItem('userData');  // Example: Check if token exists
    return of(isLoggedIn);
  }
  validateUser(body: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "Login/UserAuthentication", body).pipe(catchError(this.handleError));
  }
  getConferenceSettings(body: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "getConferenceSettings", body).pipe(catchError(this.handleError));
  }

  forgotPassword(body: any):Observable<any>{
    return this.http.post<any>(environment.apiUrl + "forgotpassword", body).pipe(catchError(this.handleError));

  }
  changePassword(body: any):Observable<any>{
    return this.http.post<any>(environment.apiUrl + "resetpassword", body).pipe(catchError(this.handleError));

  }

  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  }
  setUserInLocalStorage(user: any,name : any) {
      this.userData=user
      localStorage.setItem(name, JSON.stringify(this.userData));
  }

  logout() {
    // localStorage.removeItem('userData');
    localStorage.clear();
    // this.userData['ipscUser']="";
    // localStorage.setItem('userData', JSON.stringify(this.userData));
    this.router.navigate(["home"]);
    this.sharedService.isUserLogin.next({isUserLoggedIn:false});
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