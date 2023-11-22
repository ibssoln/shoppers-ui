import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, interval, of, tap } from 'rxjs';
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
    // return this.pushLog(LogLevel.ERROR, message);
    return '';
  }

  private flushLogs = interval(10000).subscribe(() => {
    if(this.logs.length>0){
      this.callWinston(this.logs).subscribe(() => {});
    }
  });

  private callWinston(logs: Log[]){
    const path = 'http://localhost:8080/log';
    const options = {headers: new HttpHeaders().set('Content-Type', 'application/json')};
    return this.http.post(path, logs, options).pipe(tap(data => {
      this.logs = [];
      return data;
    }), 
    catchError(
      (error: any): Observable<any> => {
        console.log('An error occurred while logging.', error);
        return of([]);
      }
    )
   );
  }

}

