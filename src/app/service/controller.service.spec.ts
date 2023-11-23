import { TestBed } from '@angular/core/testing';

import { ControllerService } from './controller.service';
import { HttpClient } from '@angular/common/http';
import { LogService } from './log.service';

describe('ControllerService', () => {
  let controllerService: ControllerService;
  let logService: LogService;
  let httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
  // let logSpy: jasmine.SpyObj<LogService> = jasmine.createSpyObj('LogService', ['logError']);

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
            ControllerService,
            { provide: HttpClient, useValue: httpClientSpy},
            LogService
        ]
    });
    controllerService = TestBed.inject(ControllerService);
    logService = TestBed.inject(LogService);
  });

  it('should be created', () => {
    expect(controllerService).toBeTruthy();
  });

});
