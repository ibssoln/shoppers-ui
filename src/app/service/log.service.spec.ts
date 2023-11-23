import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LogService } from './log.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Log, LogLevel } from 'src/app/shared/model/log.model';
import { of, throwError } from 'rxjs';

describe('LogService', () => {

  let logService: LogService;
  let httpController: HttpTestingController;
  let flushLogs: any;
//   let httpClient: HttpClient;
  let httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);


  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
            LogService,
            { provide: HttpClient, useValue: httpClientSpy},
        ]
    });
    logService = TestBed.inject(LogService);
    httpController = TestBed.inject(HttpTestingController);
    // httpClient = TestBed.inject(HttpClient);
    flushLogs = logService.flushLogs;
  });

  afterEach(() => {
    httpController.verify();
    flushLogs = logService.flushLogs;
  });

  it('should be created', () => {
    expect(logService).toBeTruthy();
  });

  it('should trigger pushLog by logInfo', (()=>{
    let spy = spyOn<any>(logService, 'pushLog');
    logService.logInfo('message');
    expect(spy).toHaveBeenCalledWith('INFO', 'message');
  }));

  it('should trigger pushLog by logDebug', (()=>{
    let spy = spyOn<any>(logService, 'pushLog');
    logService.logDebug('message2');
    expect(spy).toHaveBeenCalledWith('DEBUG', 'message2');
  }));

  it('should trigger pushLog by logError', (()=>{
    let spy = spyOn<any>(logService, 'pushLog');
    logService.logError('message3');
    expect(spy).toHaveBeenCalledWith('ERROR', 'message3');
  }));

  it('should process pushLogs - case 1', (()=>{
    logService['pushLog']('INFO', 'message4');
    expect(logService['logs'][0]).toEqual(new Log(new Date().toLocaleString(), 'INFO', 'message4'));
  }));

  it('should process pushLogs - case 2', (()=>{
    let pushLog = (logService as any)['pushLog'];
    pushLog.call(logService, 'INFO', 'message4');
    expect(logService['logs'][0]).toEqual(new Log(new Date().toLocaleString(), 'INFO', 'message4'));
  }));

//   it('should call server log endpoint and flushes out logs', (()=>{
//     let http = httpController.expectOne('http://localhost:8080/log');
//     expect(http.request.method).toBe('POST');
//     http.flush({success: true});
//     expect(logService['logs'].length).toEqual(0);
//   }));

it('should process logToServer', (done: DoneFn) => {
    let spy = spyOn<any>(logService, 'logToServer').and.returnValue(of({result: 'success'}));
    let logs: Log[] = [];
    logService.logToServer(logs).subscribe({
        next: (res: any) => {
          expect(res.result).toEqual('success');
          expect(spy).toHaveBeenCalled();
          done();
        },
        error: done.fail
      });
  });

  it('should process logToServer when error', (done: DoneFn) => {
    httpClientSpy.post.and.returnValue(throwError(()=> new HttpErrorResponse({
        error: 'A Network Error',
        status: 404
    })));
    logService.logToServer([]).subscribe({
        next: done.fail,
        error: (res: any) => {
          expect(res).toEqual(new Error('An error occurred while logging to server.'));
          done();
        },
      });
  });

});
