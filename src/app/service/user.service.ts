import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { APP } from 'src/app/shared/constant/app.const';
import { handleError } from 'src/app/shared/function/app.function';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // public httpOptions = {headers: new HttpHeaders('Content-Type': 'applicaiton/json')}
  httpClient: any;

    // private sessionState = new BehaviorSubject<sessionState>(new sessionState());
  // public sessionStateData$ = this.sessionState.asObservable();
  // public isFortressPoliciesLoaded: boolean = false;

  // public isPowerUser: boolean = false;
  // public powerUserAsAdmin: authoirzationType = new authorizationType();
  // public powerUserAsSSS: authorizationType = new authorizationType();
  // public useSSSForPowerUserRole: boolean = false;

  // public refreshRole$ = new BehaviorSubject<boolean>(false);
  // public isOptionsFormValid = false;
  // public saveExitOptions$ = new BehaviorSubject<boolean>(false);
  // public saveExitEmail$ = new BehaviorSubject<boolean>(false);
  // public saveExitPrint$ = new BehaviorSubject<boolean>(false);

  // // archive the last unsaved ready-to-save sessionState
  // public archiveReadyToSavesessionState$ = new BehaviorSubject<archiveReadyToSavesessionStateType>(new archiveReadyToSavesessionStateType());

  // // session
  // public timedOut$ = new BehaviorSubject<boolean>(false);

  constructor(
    private logService: LogService
  ) { }

  public getUserRoleAndPolicies(userId: string): Observable<any>{
    const params = {'userId': userId};
    return this.httpClient.post('/fortress', params, APP.HTTP_OPTIONS.JSON_SIMPLE)
    // .pipe(catchError(handleError));
    .pipe(catchError(this.handleError()));
  }

  // public updatesessionState(item: any): void{
  //   this.sessionState.next(item);
  // }

  // public loadUserSSOAuthenticationInfo(userInfo: User): void{
  //   this.sessionStateData$.pipe(skipWhile(value => !value), take(1)).subscribe(sessionStateData => {
  //     sessionStateData.auth.setIdName(userInfo.corpId, userInfo.firstName, userInfo.lastName);
  //     this.updatesessionState(sessionStateData);
  //   });
  // }

  // public loadUserFortressAuthorizationInfo(userId: string): void{
  //   if(!!userId && userId.trim()!=''){
  //     this.userinfoService.getUserRolesAndPolicies(userId).subscribe({next: (fortressUser: authorizationType) => {
  //       if(!!fortressUser && (userId.trim().toUpperCase() == fortressUser.userID?.trim().toUpperCase())
  //       && !!fortressUser.activeRole?.role && fortressUser.activePolicies?.length>0){
  //         fortressUser.activePolicies.forEach((pol: userPolicyType) => {
  //           const polName = APP.APP_POLICY.POLICY_NAMES.get(pol.code);
  //           pol.name = (!!polName)? polName.toUpperCase() : '';
  //         });
  //         if(fortressUser.activeRole?.role=='POWER_USER'){
  //           this.isPowerUser = true;
  //           this.powerUserAsSSS = this.buildSSSUserFromPowerUser(fortressUser);
  //           this.powerUserAsAdmin = this.buildAdminUserFromPowerUser(fortressUser);
  //           fortressUser = Object.assign({}, this.powerUserAsAdmin);
  //         }
  //         this.sessionStateData$.pipe(skipWhile(value => !value), take(1)).subscribe(sessionStateData => {
  //           sessionStateData.authorization
  //           = authorizationType.build(fortressUser.userID?.trim().toUpperCase(), fortressUser.activeRole, fortressUser.activePolicies);
  //           this.updatesessionState(sessionStateData);
  //         });
  //       }
  //       this.isFortressPoliciesLoaded = true;
  
  //     }, error: (err: any) => {
  //       this.loggerService.logError('An error occurred while getting fortress info for an SSO user. '+err);
  //     }});
  //   }
  
  // }

  // public initsessionState(){
  //   this.sessionStateData$.pipe(skipWhile(value => !value), take(1)).subscribe(sessionState => {
  //     let newsessionState = new sessionState();
  //     newsessionState.auth.setIdName(sessionState.auth.id, sessionState.auth.firstName, sessionState.auth.lastName);
  //     newsessionState.authorization = {...sessionState.authorization};
  //     this.updatesessionState(newsessionState);
  //   });
  // }

  // public sanitizesessionStateForDBSaving(sessionState: sessionState): any{
  //   const ui = sessionState.ui;
  //   delete sessionState.ui;
  //   return ui;
  // }

  // public restoreUI(sessionState: sessionState, ui: any){
  //   sessionState.ui = ui;
  // }

  // public loadsessionState(copyState: any){
  //   this.sessionStateData$.pipe(skipWhile(value => !value), take(1)).subscribe(prevsessionState => {
  //     let newsessionState = new sessionState();
  //     newsessionState.auth.setIdName(prevsessionState.auth.id, prevsessionState.auth.firstName, prevsessionState.auth.lastName);
  //     newsessionState.authorization = {...prevsessionState.authorization};
  //     newsessionState = copysessionStateDetails(newsessionState, copyState);
  //     this.updatesessionState(newsessionState);
  //   });
  
  // }

  // private buildSSSUserFromPowerUser(powerUser: authorizationType): any{
  //   let sssCopy: authorizationType = Object.assign({}, powerUser);
  //   sssCopy.activeRole = Object.assign({}, APP.ROLE_CONSTANTS.SSS_USER_ACTIVE_ROLE);
  //   let allowedSssPolicies: Array<userPolicyType> = [];
  //   sssCopy.activePolicies.forEach((pol: userPolicyType) => {
  //     if((pol.code=='AAAA') || (pol.code=='BBBB')){
  //       allowedSssPolicies.push(Object.assign({}, pol));
  //     }
  //   });
  //   sssCopy.activePolicies = [...allowedSssPolicies];
  //   return Object.assign({}, sssCopy);
  // }

  // private buildAdminUserFromPowerUser(powerUser: authorizationType): any{
  //   let adminCopy: authorizationType = Object.assign({}, powerUser);
  //   adminCopy.activeRole = Object.assign({}, APP.ROLE_CONSTANTS.ADMIN_ACTIVE_ROLE);
  //   return Object.assign({}, adminCopy);
  // }

  // public switchUserRole(useSss: boolean){
  //   this.useSssForPowerUserRole = useSss;
  //   let userRoleIdentity: authorizationType = Object.assign({}, (useSss)? this.powerUserAsSSS : this.powerUserAsAdmin);
  //   if(!!userRoleIdentity && !!userRoleIdentity.userID){
  //     this.sessionStateData$.pipe(skipWhile(value => !value), take(1)).subscribe)(sessionStateData => {
  //       sessionStateData.authorization
  //       = authorizationType.build(userRoleIdentity.userID?.trim().toUpperCase(), userRoleIdentity.activeRole, userRoleIdentity.activePolicies);
  //       this.updatesessionState(sessionStateData);
  //       this.refreshRole$.next(true);
  //     });
  //   }
  // }

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

