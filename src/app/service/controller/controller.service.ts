import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  constructor(private http: HttpClient
    ) { }

  public getData(): Observable<string[]>{
    return this.http.get<string[]>('/api/data');
  }

}
