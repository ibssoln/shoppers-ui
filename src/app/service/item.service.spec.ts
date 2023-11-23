import { TestBed } from '@angular/core/testing';

import { ItemService } from './item.service';
import { LogService } from './log.service';
import { HttpClient } from '@angular/common/http';
import { ControllerService } from './controller.service';

describe('ItemService', () => {
  let itemService: ItemService;
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
    itemService = TestBed.inject(ItemService);
    logService = TestBed.inject(LogService);
  });

  it('should be created', () => {
    expect(itemService).toBeTruthy();
  });
});
