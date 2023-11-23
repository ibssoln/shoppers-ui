import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { APP } from 'src/app/shared/constant/app.const';
import { handleError } from 'src/app/shared/function/app.function';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private httpClient: HttpClient,
    private logService: LogService
  ) { }

  public getEmailPreview(params: any): Observable<any>{
    return this.httpClient.post<any>(APP.ENDPOINT.SERVER+'/emailPreview', params, APP.HTTP_OPTIONS.JSON_SIMPLE)
          .pipe(catchError(this.handleError()));
          // .pipe(map((result: any)=>{return result;}), catchError(handleError));
  }

  public getPrintPreview(params: any): Observable<any>{
    const headers = { 'Content-Type' : 'application/json' };
      return this.httpClient.post<any>(APP.ENDPOINT.SERVER+'/printPreview', params, APP.HTTP_OPTIONS.JSON_SIMPLE) //{ headers: headers, responseType: 'blob'})
      .pipe(catchError(this.handleError()));
  }

  // ** KEEP - DO NOT REMOVE ** //
  // public getPrintPreview(params: any): Observable<any>{
  //   const headers = { 'Content-Type' : 'application/json' };
  //     return this.httpClient.post<any>(APP.ENDPOINT.SERVER+'/printPreview', params, { headers: headers, responseType: 'blob'})
  //         .pipe(map((result: any)=>{return result;}), catchError(handleError));
  // }

  public sendProofEmail(params: any): Observable<any>{
    return this.httpClient.post<any>(APP.ENDPOINT.SERVER+'/sendEmailProof', params, APP.HTTP_OPTIONS.JSON_SIMPLE)
          // .pipe(map((result: any)=>{return result;}), catchError(handleError));
          .pipe(catchError(this.handleError()));
  }

  public saveUploadFiles(params: any): Observable<any>{
    return this.httpClient.put<any>(APP.ENDPOINT.SERVER+'/uploadFiles', params, APP.HTTP_OPTIONS.JSON_SIMPLE)
          // .pipe(map((result: any)=>{return result;}), catchError(handleError));
          .pipe(catchError(this.handleError()));
  }

  public deleteUploadedFiles(fileRefId: string): Observable<any>{
    return this.httpClient.delete<any>(APP.ENDPOINT.SERVER+`/files/${fileRefId}`, APP.HTTP_OPTIONS.JSON_SIMPLE)
          // .pipe(map((result: any)=>{return result;}), catchError(handleError));
          .pipe(catchError(this.handleError()));
  }

  public saveFileInfo(id: string, userId: string, payload: any): Observable<any>{
    return this.httpClient.post<any>(APP.ENDPOINT.SERVER+`/saveFileInfo/${id}/${userId}`, payload, APP.HTTP_OPTIONS.JSON_SIMPLE)
          // .pipe(map((result: any)=>{return result;}), catchError(handleError));
          .pipe(catchError(this.handleError()));
  }

  public saveItem(params: any): Observable<any>{
    return this.httpClient.post<any>(APP.ENDPOINT.SERVER+`/saveItem`, params, APP.HTTP_OPTIONS.JSON_SIMPLE)
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
