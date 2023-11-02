import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionDataService {
  
  private sessionData = new BehaviorSubject<SessionData>(new SessionData());
  public sessionData$ = this.sessionData.asObserable();
  public isRolePoliciesLoaded: boolean = false;



  constructor() { }




}
