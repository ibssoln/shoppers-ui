import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { APP } from 'src/app/shared/constant/app.const';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private httpClient: HttpClient,
    private logService: LogService
  ) { }

  public getCategories(): Observable<any>{
    return this.httpClient.get<any>(APP.ENDPOINT.SERVER+`/category/categories`, APP.HTTP_OPTIONS.JSON_SIMPLE)
          // .pipe(tap((result: any)=>{console.log('data = '+JSON.stringify(result));return result;})
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

  private handleErrorWithError(err: HttpErrorResponse): any{
      if(err.error instanceof ErrorEvent){
        this.logService.logError(`An error occurred: ${err.error.message}`);
      }else{
        this.logService.logError(`An error occurred: status ${err.status}, ${err.error}`);
      }
      return throwError(() => new Error('An error occurred. Please try again.'));
  } 


}
