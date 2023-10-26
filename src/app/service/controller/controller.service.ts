import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  constructor(private http: HttpClient
    ) { }

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

}
