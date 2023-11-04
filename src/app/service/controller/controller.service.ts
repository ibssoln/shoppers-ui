import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(
    private httpClient: HttpClient
    ) { }

  // Note: do not delete until faq is done.  
  public getData(): Observable<any>{
    // return this.http.get<string[]>('/api/data');
    return of({
      data: [
        {
          compositeKey: 'abc',
          levelName: 'name 1',
          businessId: 'busid 1',
          editTime: '2023/10/28',
          selected: false,
          description: 'desc 1'
        },
        {
          compositeKey: 'def',
          levelName: 'name 2',
          businessId: 'busid 2',
          editTime: '2012/10/28',
          selected: false,
          description: 'desc 2'
        }
      ],
      total: 10
    });
  }

  public getItems(): Observable<any>{
    return this.httpClient.get<any>(`http://localhost:8081/api/test2`, this.httpOptions).pipe(
      map(result=>{
        return result;
      }),
      catchError(this.handleError)
    )
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
