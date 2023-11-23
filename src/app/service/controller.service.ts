import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { APP } from 'src/app/shared/constant/app.const';
import { handleError } from 'src/app/shared/function/app.function';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  constructor(
    private httpClient: HttpClient,
    private logService: LogService
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
    return this.httpClient.get<any>(APP.ENDPOINT.SERVER+`/product/items`, APP.HTTP_OPTIONS.JSON_SIMPLE)
          // .pipe(map((result: any)=>{return result;}), catchError(handleError));
          .pipe(catchError(this.handleError()));
  }

  private handleError(): any{
    return (err: HttpErrorResponse)=> { 
      if(err.error instanceof ErrorEvent){
        this.logService.logError(`An error occurred: ${err.error.message}`);
      }else{
        this.logService.logError(`An error occurred: status ${err.status}, ${err.error}`);
      }
      return throwError(() => new Error('An error occurred. Please try again.'));
    }
  } 

  private handleGivenError(err: HttpErrorResponse): any{
      if(err.error instanceof ErrorEvent){
        this.logService.logError(`An error occurred: ${err.error.message}`);
      }else{
        this.logService.logError(`An error occurred: status ${err.status}, ${err.error}`);
      }
      return throwError(() => new Error('An error occurred. Please try again.'));
  } 

}
