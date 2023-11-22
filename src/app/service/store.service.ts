import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { APP } from 'src/app/shared/constant/app.const';
import { handleError } from 'src/app/shared/function/app.function';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(
    private httpClient: HttpClient,
    private logService: LogService
  ) { }

  public getStores(): Observable<any>{
    return this.httpClient.get<any>(APP.ENDPOINT.SERVER+`/store/stores`, APP.HTTP_OPTIONS.JSON_SIMPLE)
          .pipe(map((result: any)=>{return result;}), catchError(handleError));
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
