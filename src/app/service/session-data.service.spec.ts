import { TestBed } from '@angular/core/testing';

import { SessionDataService } from './session-data.service';
import { LogService } from './log.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

describe('SessionDataService', () => {
  let sessionDataService: SessionDataService;
  let logService: LogService;
  let httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
  // let logSpy: jasmine.SpyObj<LogService> = jasmine.createSpyObj('LogService', ['logError']);

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
            SessionDataService,
            { provide: HttpClient, useValue: httpClientSpy},
            LogService
        ]
    });
    sessionDataService = TestBed.inject(SessionDataService);
    logService = TestBed.inject(LogService);
  });

  it('should be created', () => {
    expect(sessionDataService).toBeTruthy();
  });

  it('should handle ErrorEvent-type error with handler', () => {
    const logServiceSpy = spyOn(logService, 'logError');
    const errorResp = new HttpErrorResponse({
       error: new ErrorEvent('404', {message: 'Not Found'}),
       status: 404, 
       statusText: 'Not Found' 
    });
    sessionDataService['handleGivenError'](errorResp);
    expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: Not Found');
  });

  it('should handle text-type error with handler', () => {
    const logServiceSpy = spyOn(logService, 'logError');
    const errorResp = new HttpErrorResponse({
       error: 'Test Error',
       status: 404, 
       statusText: 'Not Found' 
    });
    sessionDataService['handleGivenError'](errorResp);
    expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: status 404, Test Error');
  });

});
