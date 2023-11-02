import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private httpClient: HttpClient
  ) { }

  private httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
          }

  public getEmailPreview(params: any): Observable<any>{
    return this.httpClient.post<any>('http://localhost:8080/emailPreview', params, this.httpOptions).pipe(catchError(this.handleError));
  }

  public getPrintPreview(params: any): Observable<any>{
    const headers = { 'Content-Type' : 'application/json' };
      return this.httpClient.post<any>('http://localhost:8080/printPreview', params, { headers, responseType: 'blob'}).pipe(catchError(this.handleError));
  }

  public sendProofEmail(params: any): Observable<any>{
    return this.httpClient.post<any>('http://localhost:8080/sendEmailProof', params, this.httpOptions).pipe(catchError(this.handleError));
  }

  public saveUploadFiles(params: any): Observable<any>{
    return this.httpClient.put<any>('/uploadFiles', params, this.httpOptions).pipe(catchError(this.handleError));
  }

  public deleteUploadedFiles(fileRefId: string): Observable<any>{
    return this.httpClient.delete<any>(`/files/${fileRefId}`, this.httpOptions).pipe(catchError(this.handleError));
  }

  public saveFileInfo(id: string, userId: string, payload: any): Observable<any>{
    return this.httpClient.post<any>(`/saveFileInfo/${id}/${userId}`, payload, this.httpOptions).pipe(catchError(this.handleError));
  }

  public saveItem(params: any): Observable<any>{
    return this.httpClient.post<any>(`/saveItem`, params, this.httpOptions).pipe(catchError(this.handleError));
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
