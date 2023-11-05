import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { APP } from 'src/app/shared/constant/app.const';
import { handleError } from 'src/app/shared/function/app.function';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  public getSpecialDealItems(): Observable<any>{
    return this.httpClient.get<any>(APP.ENDPOINT.SERVER+`/product/items`, APP.HTTP_OPTIONS.JSON_SIMPLE)
          .pipe(map((result: any)=>{console.log('data = '+JSON.stringify(result));return result;}), catchError(handleError));
  }


}
