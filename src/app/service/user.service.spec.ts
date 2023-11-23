import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { LogService } from './log.service';
import { HttpClient } from '@angular/common/http';

describe('UserService', () => {

  let userService: UserService;
  let logService: LogService;
  let httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
  // let logSpy: jasmine.SpyObj<LogService> = jasmine.createSpyObj('LogService', ['logError']);

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
            UserService,
            { provide: HttpClient, useValue: httpClientSpy},
            LogService
        ]
    });
    userService = TestBed.inject(UserService);
    logService = TestBed.inject(LogService);
  });

  it('should be created', () => {
    expect(userService).toBeTruthy();
  });

});
