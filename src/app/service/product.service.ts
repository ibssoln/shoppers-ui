import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { APP } from 'src/app/shared/constant/app.const';
import { handleError } from 'src/app/shared/function/app.function';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public getEmailPreview(params: any): Observable<any>{
    return this.httpClient.post<any>(APP.ENDPOINT.SERVER+'/emailPreview', params, APP.HTTP_OPTIONS.JSON_SIMPLE)
          .pipe(map((result: any)=>{return result;}), catchError(handleError));
  }

  public getPrintPreview(params: any): Observable<any>{
    const headers = { 'Content-Type' : 'application/json' };
      return this.httpClient.post<any>(APP.ENDPOINT.SERVER+'/printPreview', params, { headers: headers, responseType: 'blob'})
          .pipe(map((result: any)=>{return result;}), catchError(handleError));
  }

  public sendProofEmail(params: any): Observable<any>{
    return this.httpClient.post<any>(APP.ENDPOINT.SERVER+'/sendEmailProof', params, APP.HTTP_OPTIONS.JSON_SIMPLE)
          .pipe(map((result: any)=>{return result;}), catchError(handleError));
  }

  public saveUploadFiles(params: any): Observable<any>{
    return this.httpClient.put<any>(APP.ENDPOINT.SERVER+'/uploadFiles', params, APP.HTTP_OPTIONS.JSON_SIMPLE)
          .pipe(map((result: any)=>{return result;}), catchError(handleError));
  }

  public deleteUploadedFiles(fileRefId: string): Observable<any>{
    return this.httpClient.delete<any>(APP.ENDPOINT.SERVER+`/files/${fileRefId}`, APP.HTTP_OPTIONS.JSON_SIMPLE)
          .pipe(map((result: any)=>{return result;}), catchError(handleError));
  }

  public saveFileInfo(id: string, userId: string, payload: any): Observable<any>{
    return this.httpClient.post<any>(APP.ENDPOINT.SERVER+`/saveFileInfo/${id}/${userId}`, payload, APP.HTTP_OPTIONS.JSON_SIMPLE)
          .pipe(map((result: any)=>{return result;}), catchError(handleError));
  }

  public saveItem(params: any): Observable<any>{
    return this.httpClient.post<any>(APP.ENDPOINT.SERVER+`/saveItem`, params, APP.HTTP_OPTIONS.JSON_SIMPLE)
          .pipe(map((result: any)=>{return result;}), catchError(handleError));
  }

}
