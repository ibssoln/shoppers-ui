import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public httpOptions = {headers: new HttpHeaders('Content-Type': 'applicaiton/json')}
  httpClient: any;

  constructor() { }

  public getUserRoleAndPolicies(userId: string): Observable<any>{
    const params = {'userId': userId};
    return this.httpClient.post('/fortress', params, this.httpOptions).pipe(catchError(this.handleError));
  }

  private handleError(obj: HttpErrorResponse): any{
    if(obj.error){
      // this.loggerService.logError('An error occurred: ${obj.error.message}');
    }else{
      // this.loggerService.logError('An error occurred: status ${obj.status}, ${obj.error}');
    }
    return throwError(() => new Error('An error occurred. Please try again.'));
  }  

}
