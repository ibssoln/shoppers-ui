import { TestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { LogService } from './log.service';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let logService: LogService;
  let httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
  // let logSpy: jasmine.SpyObj<LogService> = jasmine.createSpyObj('LogService', ['logError']);

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
            CategoryService,
            { provide: HttpClient, useValue: httpClientSpy},
            LogService
        ]
    });
    categoryService = TestBed.inject(CategoryService);
    logService = TestBed.inject(LogService);
  });

  it('should be created', () => {
    expect(categoryService).toBeTruthy();
  });

  it('should handle ErrorEvent errors while executing getCategories', (done: DoneFn) => {
    let logServiceSpy = spyOn<any>(logService, 'logError');
    logServiceSpy.and.returnValue('');
    let spyCalls = httpClientSpy.get.calls.count();
    httpClientSpy.get.and.returnValue(throwError(()=> new HttpErrorResponse({
      error: new ErrorEvent('404', {message: 'Not Found'}),
      status: 404
    })));
    categoryService.getCategories().subscribe({
      next: done.fail,
      error: (errorMessage)=>{
        expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: Not Found');
        expect(errorMessage).toEqual(new Error('An error occurred. Please try again.'));
        done();
      }
    });
    expect(httpClientSpy.get.calls.count()).toBe(spyCalls+1);
  });

  it('should handle text errors while executing getCategories', (done: DoneFn) => {
    let logServiceSpy = spyOn<any>(logService, 'logError');
    logServiceSpy.and.returnValue('');
    let spyCalls = httpClientSpy.get.calls.count();
    httpClientSpy.get.and.returnValue(throwError(()=> new HttpErrorResponse({
      error: 'A Text Error',
      status: 404
    })));
    categoryService.getCategories().subscribe({
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
    categoryService['handleErrorWithError'](errorResp);
    expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: Not Found');
  });

  it('should handle text-type error with handler', () => {
    const logServiceSpy = spyOn(logService, 'logError');
    const errorResp = new HttpErrorResponse({
       error: 'Test Error',
       status: 404, 
       statusText: 'Not Found' 
    });
    categoryService['handleErrorWithError'](errorResp);
    expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: status 404, Test Error');
  });

  
 

});
