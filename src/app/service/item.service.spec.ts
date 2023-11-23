import { TestBed } from '@angular/core/testing';

import { ItemService } from './item.service';
import { LogService } from './log.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ControllerService } from './controller.service';
import { of, throwError } from 'rxjs';

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

  it('should process getSpecialDealItems', () => {
    spyOn(itemService, 'getSpecialDealItems').and.returnValue(of({results: [{id: 123}, {id: 456}], status: '200 OK', statusText: 'SUCCESS'}));
    itemService.getSpecialDealItems().subscribe((res: any) => {
      expect(res.status).toEqual('200 OK');
      expect(res.statusText).toEqual('SUCCESS');
      expect(res.results.length).toEqual(2);
    });
  });

  it('should process getSpecialDealItems through httpClient', (done: DoneFn) => {
    spyOn(itemService, 'getSpecialDealItems').and.returnValue(of({results: [{id: 123}, {id: 456}], status: '200 OK', statusText: 'SUCCESS'}));
    itemService.getSpecialDealItems().subscribe({
      next: (res: any) => {
        expect(res.status).toEqual('200 OK');
        expect(res.statusText).toEqual('SUCCESS');
        expect(res.results.length).toEqual(2);
        done();
      },
      error: done.fail
    });
  });

  it('should handle ErrorEvent errors while executing getSpecialDealItems', (done: DoneFn) => {
    let logServiceSpy = spyOn<any>(logService, 'logError');
    logServiceSpy.and.returnValue('');
    let spyCalls = httpClientSpy.get.calls.count();
    httpClientSpy.get.and.returnValue(throwError(()=> new HttpErrorResponse({
      error: new ErrorEvent('404', {message: 'Not Found'}),
      status: 404
    })));
    itemService.getSpecialDealItems().subscribe({
      next: done.fail,
      error: (errorMessage)=>{
        expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: Not Found');
        expect(errorMessage).toEqual(new Error('An error occurred. Please try again.'));
        expect(httpClientSpy.get.calls.count()).toBe(spyCalls+1);
        done();
      }
    });
  });

  it('should handle text errors while executing getSpecialDealItems', (done: DoneFn) => {
    let logServiceSpy = spyOn<any>(logService, 'logError');
    logServiceSpy.and.returnValue('');
    let spyCalls = httpClientSpy.get.calls.count();
    httpClientSpy.get.and.returnValue(throwError(()=> new HttpErrorResponse({
      error: 'A Text Error',
      status: 404
    })));
    itemService.getSpecialDealItems().subscribe({
      next: done.fail,
      error: (errorMessage)=>{
        expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: status 404, A Text Error');
        expect(errorMessage).toEqual(new Error('An error occurred. Please try again.'));
        done();
      }
    });
    expect(httpClientSpy.get.calls.count()).toBe(spyCalls+1);
  });

  it('should process getItems', () => {
    spyOn(itemService, 'getItems').and.returnValue(of({results: [{id: 123}, {id: 456}], status: '200 OK', statusText: 'SUCCESS'}));
    itemService.getItems().subscribe((res: any) => {
      expect(res.status).toEqual('200 OK');
      expect(res.statusText).toEqual('SUCCESS');
      expect(res.results.length).toEqual(2);
    });
  });

  it('should process getItems through httpClient', (done: DoneFn) => {
    spyOn(itemService, 'getItems').and.returnValue(of({results: [{id: 123}, {id: 456}], status: '200 OK', statusText: 'SUCCESS'}));
    itemService.getItems().subscribe({
      next: (res: any) => {
        expect(res.status).toEqual('200 OK');
        expect(res.statusText).toEqual('SUCCESS');
        expect(res.results.length).toEqual(2);
        done();
      },
      error: done.fail
    });
  });

  it('should handle ErrorEvent errors while executing getItems', (done: DoneFn) => {
    let logServiceSpy = spyOn<any>(logService, 'logError');
    logServiceSpy.and.returnValue('');
    let spyCalls = httpClientSpy.get.calls.count();
    httpClientSpy.get.and.returnValue(throwError(()=> new HttpErrorResponse({
      error: new ErrorEvent('404', {message: 'Not Found'}),
      status: 404
    })));
    itemService.getItems().subscribe({
      next: done.fail,
      error: (errorMessage)=>{
        expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: Not Found');
        expect(errorMessage).toEqual(new Error('An error occurred. Please try again.'));
        expect(httpClientSpy.get.calls.count()).toBe(spyCalls+1);
        done();
      }
    });
  });

  it('should handle text errors while executing getItems', (done: DoneFn) => {
    let logServiceSpy = spyOn<any>(logService, 'logError');
    logServiceSpy.and.returnValue('');
    let spyCalls = httpClientSpy.get.calls.count();
    httpClientSpy.get.and.returnValue(throwError(()=> new HttpErrorResponse({
      error: 'A Text Error',
      status: 404
    })));
    itemService.getItems().subscribe({
      next: done.fail,
      error: (errorMessage)=>{
        expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: status 404, A Text Error');
        expect(errorMessage).toEqual(new Error('An error occurred. Please try again.'));
        done();
      }
    });
    expect(httpClientSpy.get.calls.count()).toBe(spyCalls+1);
  });

  it('should process getItemsByShop', () => {
    spyOn(itemService, 'getItemsByShop').and.returnValue(of({results: [{id: 123}, {id: 456}], status: '200 OK', statusText: 'SUCCESS'}));
    itemService.getItemsByShop("123").subscribe((res: any) => {
      expect(res.status).toEqual('200 OK');
      expect(res.statusText).toEqual('SUCCESS');
      expect(res.results.length).toEqual(2);
    });
  });

  it('should process getItemsByShop through httpClient', (done: DoneFn) => {
    spyOn(itemService, 'getItemsByShop').and.returnValue(of({results: [{id: 123}, {id: 456}], status: '200 OK', statusText: 'SUCCESS'}));
    itemService.getItemsByShop("123").subscribe({
      next: (res: any) => {
        expect(res.status).toEqual('200 OK');
        expect(res.statusText).toEqual('SUCCESS');
        expect(res.results.length).toEqual(2);
        done();
      },
      error: done.fail
    });
  });

  it('should handle ErrorEvent errors while executing getItemsByShop', (done: DoneFn) => {
    let logServiceSpy = spyOn<any>(logService, 'logError');
    logServiceSpy.and.returnValue('');
    let spyCalls = httpClientSpy.get.calls.count();
    httpClientSpy.get.and.returnValue(throwError(()=> new HttpErrorResponse({
      error: new ErrorEvent('404', {message: 'Not Found'}),
      status: 404
    })));
    itemService.getItemsByShop("123").subscribe({
      next: done.fail,
      error: (errorMessage)=>{
        expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: Not Found');
        expect(errorMessage).toEqual(new Error('An error occurred. Please try again.'));
        expect(httpClientSpy.get.calls.count()).toBe(spyCalls+1);
        done();
      }
    });
  });

  it('should handle text errors while executing getItemsByShop', (done: DoneFn) => {
    let logServiceSpy = spyOn<any>(logService, 'logError');
    logServiceSpy.and.returnValue('');
    let spyCalls = httpClientSpy.get.calls.count();
    httpClientSpy.get.and.returnValue(throwError(()=> new HttpErrorResponse({
      error: 'A Text Error',
      status: 404
    })));
    itemService.getItemsByShop("123").subscribe({
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
    itemService['handleGivenError'](errorResp);
    expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: Not Found');
  });

  it('should handle text-type error with handler', () => {
    const logServiceSpy = spyOn(logService, 'logError');
    const errorResp = new HttpErrorResponse({
       error: 'Test Error',
       status: 404, 
       statusText: 'Not Found' 
    });
    itemService['handleGivenError'](errorResp);
    expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: status 404, Test Error');
  });

});
