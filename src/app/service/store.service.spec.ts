import { TestBed } from '@angular/core/testing';

import { StoreService } from './store.service';
import { LogService } from './log.service';
import { HttpClient } from '@angular/common/http';

describe('StoreService', () => {
    
  let storeService: StoreService;
  let logService: LogService;
  let httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
  // let logSpy: jasmine.SpyObj<LogService> = jasmine.createSpyObj('LogService', ['logError']);

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
            StoreService,
            { provide: HttpClient, useValue: httpClientSpy},
            LogService
        ]
    });
    storeService = TestBed.inject(StoreService);
    logService = TestBed.inject(LogService);
  });

  it('should be created', () => {
    expect(storeService).toBeTruthy();
  });

});
