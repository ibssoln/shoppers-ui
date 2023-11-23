import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, interval, of, tap, throwError } from 'rxjs';
import { Log, LogLevel } from 'src/app/shared/model/log.model';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private logs: Array<Log> = new Array();
  private periodSeconds = 10000;

  constructor(
    private http: HttpClient
  ) { }

  private pushLog(level: string, message: string){
    this.logs.push(new Log(new Date().toLocaleString(), level, message));
  }

  public logInfo(message: string){
    console.log(message);
    return this.pushLog(LogLevel.INFO, message);
  }

  public logDebug(message: string){
    console.debug(message);
    return this.pushLog(LogLevel.DEBUG, message);
  }

  public logError(message: string){
    console.error(message);
    return this.pushLog(LogLevel.ERROR, message);
  }

  public flushLogs = interval(10000).subscribe(() => {
    if(this.logs.length>0){
      this.logToServer(this.logs).subscribe(() => {});
    }
  });

  public logToServer(logs: Log[]): Observable<any>{
    const path = 'http://localhost:8080/log';
    const options = {headers: new HttpHeaders().set('Content-Type', 'application/json')};
    return this.http.post(path, logs, options)
           .pipe(tap((data: any)=>{this.logs = []; return data;}))
           .pipe(catchError(
            (err: HttpErrorResponse)=> { 
              console.log('An error occurred while logging.', err);
              return throwError(() => new Error('An error occurred while logging to server.'));
            }
          ));
  }

}

