import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { APP } from 'src/app/shared/constant/app.const';
import { handleError } from 'src/app/shared/function/app.function';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public getStores(): Observable<any>{
    return this.httpClient.get<any>(APP.ENDPOINT.SERVER+`/store/stores`, APP.HTTP_OPTIONS.JSON_SIMPLE)
          .pipe(map((result: any)=>{return result;}), catchError(handleError));
  }

}
