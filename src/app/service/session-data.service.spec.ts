import { TestBed } from '@angular/core/testing';

import { SessionDataService } from './session-data.service';
import { LogService } from './log.service';
import { HttpClient } from '@angular/common/http';

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

});
