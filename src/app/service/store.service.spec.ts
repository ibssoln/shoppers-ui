import { TestBed } from '@angular/core/testing';

import { StoreService } from './store.service';
import { LogService } from './log.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

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

  it('should process getStores', () => {
    spyOn(storeService, 'getStores').and.returnValue(of({results: [{id: 123}, {id: 456}], status: '200 OK', statusText: 'SUCCESS'}));
    storeService.getStores().subscribe((res: any) => {
      expect(res.status).toEqual('200 OK');
      expect(res.statusText).toEqual('SUCCESS');
      expect(res.results.length).toEqual(2);
    });
  });

  it('should process getStores through httpClient', (done: DoneFn) => {
    spyOn(storeService, 'getStores').and.returnValue(of({results: [{id: 123}, {id: 456}], status: '200 OK', statusText: 'SUCCESS'}));
    storeService.getStores().subscribe({
      next: (res: any) => {
        expect(res.status).toEqual('200 OK');
        expect(res.statusText).toEqual('SUCCESS');
        expect(res.results.length).toEqual(2);
        done();
      },
      error: done.fail
    });
  });

  it('should handle ErrorEvent errors while executing getStores', (done: DoneFn) => {
    let logServiceSpy = spyOn<any>(logService, 'logError');
    logServiceSpy.and.returnValue('');
    let spyCalls = httpClientSpy.get.calls.count();
    httpClientSpy.get.and.returnValue(throwError(()=> new HttpErrorResponse({
      error: new ErrorEvent('404', {message: 'Not Found'}),
      status: 404
    })));
    storeService.getStores().subscribe({
      next: done.fail,
      error: (errorMessage)=>{
        expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: Not Found');
        expect(errorMessage).toEqual(new Error('An error occurred. Please try again.'));
        expect(httpClientSpy.get.calls.count()).toBe(spyCalls+1);
        done();
      }
    });
  });

  it('should handle text errors while executing getStores', (done: DoneFn) => {
    let logServiceSpy = spyOn<any>(logService, 'logError');
    logServiceSpy.and.returnValue('');
    let spyCalls = httpClientSpy.get.calls.count();
    httpClientSpy.get.and.returnValue(throwError(()=> new HttpErrorResponse({
      error: 'A Text Error',
      status: 404
    })));
    storeService.getStores().subscribe({
      next: done.fail,
      error: (errorMessage)=>{
        expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: status 404, A Text Error');
        expect(errorMessage).toEqual(new Error('An error occurred. Please try again.'));
        done();
      }
    });
    expect(httpClientSpy.get.calls.count()).toBe(spyCalls+1);
  });

  it('should handle ErrorEvent-type error with handler', () => {
    const logServiceSpy = spyOn(logService, 'logError');
    const errorResp = new HttpErrorResponse({
       error: new ErrorEvent('404', {message: 'Not Found'}),
       status: 404, 
       statusText: 'Not Found' 
    });
    storeService['handleGivenError'](errorResp);
    expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: Not Found');
  });

  it('should handle text-type error with handler', () => {
    const logServiceSpy = spyOn(logService, 'logError');
    const errorResp = new HttpErrorResponse({
       error: 'Test Error',
       status: 404, 
       statusText: 'Not Found' 
    });
    storeService['handleGivenError'](errorResp);
    expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: status 404, Test Error');
  });

});
