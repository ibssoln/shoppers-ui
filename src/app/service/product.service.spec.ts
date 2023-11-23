import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import { LogService } from './log.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('ProductService', () => {
  let productService: ProductService;
  let logService: LogService;
  let httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
  // let logSpy: jasmine.SpyObj<LogService> = jasmine.createSpyObj('LogService', ['logError']);

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
            ProductService,
            { provide: HttpClient, useValue: httpClientSpy},
            LogService
        ]
    });
    productService = TestBed.inject(ProductService);
    logService = TestBed.inject(LogService);
  });

  it('should be created', () => {
    expect(productService).toBeTruthy();
  });

  //--- 1

  it('should process getEmailPreview', () => {
    spyOn(productService, 'getEmailPreview').and.returnValue(of({results: [{id: 123}, {id: 456}], status: '200 OK', statusText: 'SUCCESS'}));
    productService.getEmailPreview({}).subscribe((res: any) => {
      expect(res.status).toEqual('200 OK');
      expect(res.statusText).toEqual('SUCCESS');
      expect(res.results.length).toEqual(2);
    });
  });

  it('should process getEmailPreview through httpClient', (done: DoneFn) => {
    spyOn(productService, 'getEmailPreview').and.returnValue(of({results: [{id: 123}, {id: 456}], status: '200 OK', statusText: 'SUCCESS'}));
    productService.getEmailPreview({}).subscribe({
      next: (res: any) => {
        expect(res.status).toEqual('200 OK');
        expect(res.statusText).toEqual('SUCCESS');
        expect(res.results.length).toEqual(2);
        done();
      },
      error: done.fail
    });
  });

  it('should handle ErrorEvent errors while executing getEmailPreview', (done: DoneFn) => {
    let logServiceSpy = spyOn<any>(logService, 'logError');
    logServiceSpy.and.returnValue('');
    let spyCalls = httpClientSpy.post.calls.count();
    httpClientSpy.post.and.returnValue(throwError(()=> new HttpErrorResponse({
      error: new ErrorEvent('404', {message: 'Not Found'}),
      status: 404
    })));
    productService.getEmailPreview({}).subscribe({
      next: done.fail,
      error: (errorMessage)=>{
        expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: Not Found');
        expect(errorMessage).toEqual(new Error('An error occurred. Please try again.'));
        expect(httpClientSpy.post.calls.count()).toBe(spyCalls+1);
        done();
      }
    });
  });

  it('should handle text errors while executing getEmailPreview', (done: DoneFn) => {
    let logServiceSpy = spyOn<any>(logService, 'logError');
    logServiceSpy.and.returnValue('');
    let spyCalls = httpClientSpy.post.calls.count();
    httpClientSpy.post.and.returnValue(throwError(()=> new HttpErrorResponse({
      error: 'A Text Error',
      status: 404
    })));
    productService.getEmailPreview({}).subscribe({
      next: done.fail,
      error: (errorMessage)=>{
        expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: status 404, A Text Error');
        expect(errorMessage).toEqual(new Error('An error occurred. Please try again.'));
        done();
      }
    });
    expect(httpClientSpy.post.calls.count()).toBe(spyCalls+1);
  });

  //---2

  it('should process getPrintPreview', () => {
    spyOn(productService, 'getPrintPreview').and.returnValue(of({results: [{id: 123}, {id: 456}], status: '200 OK', statusText: 'SUCCESS'}));
    productService.getPrintPreview({}).subscribe((res: any) => {
      expect(res.status).toEqual('200 OK');
      expect(res.statusText).toEqual('SUCCESS');
      expect(res.results.length).toEqual(2);
    });
  });

  it('should process getPrintPreview through httpClient', (done: DoneFn) => {
    spyOn(productService, 'getPrintPreview').and.returnValue(of({results: [{id: 123}, {id: 456}], status: '200 OK', statusText: 'SUCCESS'}));
    productService.getPrintPreview({}).subscribe({
      next: (res: any) => {
        expect(res.status).toEqual('200 OK');
        expect(res.statusText).toEqual('SUCCESS');
        expect(res.results.length).toEqual(2);
        done();
      },
      error: done.fail
    });
  });

  it('should handle ErrorEvent errors while executing getPrintPreview', (done: DoneFn) => {
    let logServiceSpy = spyOn<any>(logService, 'logError');
    logServiceSpy.and.returnValue('');
    let spyCalls = httpClientSpy.post.calls.count();
    httpClientSpy.post.and.returnValue(throwError(()=> new HttpErrorResponse({
      error: new ErrorEvent('404', {message: 'Not Found'}),
      status: 404
    })));
    productService.getPrintPreview({}).subscribe({
      next: done.fail,
      error: (errorMessage)=>{
        expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: Not Found');
        expect(errorMessage).toEqual(new Error('An error occurred. Please try again.'));
        expect(httpClientSpy.post.calls.count()).toBe(spyCalls+1);
        done();
      }
    });
  });

  it('should handle text errors while executing getPrintPreview', (done: DoneFn) => {
    let logServiceSpy = spyOn<any>(logService, 'logError');
    logServiceSpy.and.returnValue('');
    let spyCalls = httpClientSpy.post.calls.count();
    httpClientSpy.post.and.returnValue(throwError(()=> new HttpErrorResponse({
      error: 'A Text Error',
      status: 404
    })));
    productService.getPrintPreview({}).subscribe({
      next: done.fail,
      error: (errorMessage)=>{
        expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: status 404, A Text Error');
        expect(errorMessage).toEqual(new Error('An error occurred. Please try again.'));
        done();
      }
    });
    expect(httpClientSpy.post.calls.count()).toBe(spyCalls+1);
  });

  //---3

  it('should process sendProofEmail', () => {
    spyOn(productService, 'sendProofEmail').and.returnValue(of({results: [{id: 123}, {id: 456}], status: '200 OK', statusText: 'SUCCESS'}));
    productService.sendProofEmail({}).subscribe((res: any) => {
      expect(res.status).toEqual('200 OK');
      expect(res.statusText).toEqual('SUCCESS');
      expect(res.results.length).toEqual(2);
    });
  });

  it('should process sendProofEmail through httpClient', (done: DoneFn) => {
    spyOn(productService, 'sendProofEmail').and.returnValue(of({results: [{id: 123}, {id: 456}], status: '200 OK', statusText: 'SUCCESS'}));
    productService.sendProofEmail({}).subscribe({
      next: (res: any) => {
        expect(res.status).toEqual('200 OK');
        expect(res.statusText).toEqual('SUCCESS');
        expect(res.results.length).toEqual(2);
        done();
      },
      error: done.fail
    });
  });

  it('should handle ErrorEvent errors while executing sendProofEmail', (done: DoneFn) => {
    let logServiceSpy = spyOn<any>(logService, 'logError');
    logServiceSpy.and.returnValue('');
    let spyCalls = httpClientSpy.post.calls.count();
    httpClientSpy.post.and.returnValue(throwError(()=> new HttpErrorResponse({
      error: new ErrorEvent('404', {message: 'Not Found'}),
      status: 404
    })));
    productService.sendProofEmail({}).subscribe({
      next: done.fail,
      error: (errorMessage)=>{
        expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: Not Found');
        expect(errorMessage).toEqual(new Error('An error occurred. Please try again.'));
        expect(httpClientSpy.post.calls.count()).toBe(spyCalls+1);
        done();
      }
    });
  });

  it('should handle text errors while executing sendProofEmail', (done: DoneFn) => {
    let logServiceSpy = spyOn<any>(logService, 'logError');
    logServiceSpy.and.returnValue('');
    let spyCalls = httpClientSpy.post.calls.count();
    httpClientSpy.post.and.returnValue(throwError(()=> new HttpErrorResponse({
      error: 'A Text Error',
      status: 404
    })));
    productService.sendProofEmail({}).subscribe({
      next: done.fail,
      error: (errorMessage)=>{
        expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: status 404, A Text Error');
        expect(errorMessage).toEqual(new Error('An error occurred. Please try again.'));
        done();
      }
    });
    expect(httpClientSpy.post.calls.count()).toBe(spyCalls+1);
  });

  //---4

  it('should process saveUploadFiles', () => {
    spyOn(productService, 'saveUploadFiles').and.returnValue(of({results: [{id: 123}, {id: 456}], status: '200 OK', statusText: 'SUCCESS'}));
    productService.saveUploadFiles({}).subscribe((res: any) => {
      expect(res.status).toEqual('200 OK');
      expect(res.statusText).toEqual('SUCCESS');
      expect(res.results.length).toEqual(2);
    });
  });

  it('should process saveUploadFiles through httpClient', (done: DoneFn) => {
    spyOn(productService, 'saveUploadFiles').and.returnValue(of({results: [{id: 123}, {id: 456}], status: '200 OK', statusText: 'SUCCESS'}));
    productService.saveUploadFiles({}).subscribe({
      next: (res: any) => {
        expect(res.status).toEqual('200 OK');
        expect(res.statusText).toEqual('SUCCESS');
        expect(res.results.length).toEqual(2);
        done();
      },
      error: done.fail
    });
  });

  it('should handle ErrorEvent errors while executing saveUploadFiles', (done: DoneFn) => {
    let logServiceSpy = spyOn<any>(logService, 'logError');
    logServiceSpy.and.returnValue('');
    let spyCalls = httpClientSpy.put.calls.count();
    httpClientSpy.put.and.returnValue(throwError(()=> new HttpErrorResponse({
      error: new ErrorEvent('404', {message: 'Not Found'}),
      status: 404
    })));
    productService.saveUploadFiles({}).subscribe({
      next: done.fail,
      error: (errorMessage)=>{
        expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: Not Found');
        expect(errorMessage).toEqual(new Error('An error occurred. Please try again.'));
        expect(httpClientSpy.put.calls.count()).toBe(spyCalls+1);
        done();
      }
    });
  });

  it('should handle text errors while executing saveUploadFiles', (done: DoneFn) => {
    let logServiceSpy = spyOn<any>(logService, 'logError');
    logServiceSpy.and.returnValue('');
    let spyCalls = httpClientSpy.put.calls.count();
    httpClientSpy.put.and.returnValue(throwError(()=> new HttpErrorResponse({
      error: 'A Text Error',
      status: 404
    })));
    productService.saveUploadFiles({}).subscribe({
      next: done.fail,
      error: (errorMessage)=>{
        expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: status 404, A Text Error');
        expect(errorMessage).toEqual(new Error('An error occurred. Please try again.'));
        done();
      }
    });
    expect(httpClientSpy.put.calls.count()).toBe(spyCalls+1);
  });

  //--5

  it('should process deleteUploadedFiles', () => {
    spyOn(productService, 'deleteUploadedFiles').and.returnValue(of({results: [{id: 123}, {id: 456}], status: '200 OK', statusText: 'SUCCESS'}));
    productService.deleteUploadedFiles("").subscribe((res: any) => {
      expect(res.status).toEqual('200 OK');
      expect(res.statusText).toEqual('SUCCESS');
      expect(res.results.length).toEqual(2);
    });
  });

  it('should process deleteUploadedFiles through httpClient', (done: DoneFn) => {
    spyOn(productService, 'deleteUploadedFiles').and.returnValue(of({results: [{id: 123}, {id: 456}], status: '200 OK', statusText: 'SUCCESS'}));
    productService.deleteUploadedFiles("").subscribe({
      next: (res: any) => {
        expect(res.status).toEqual('200 OK');
        expect(res.statusText).toEqual('SUCCESS');
        expect(res.results.length).toEqual(2);
        done();
      },
      error: done.fail
    });
  });

  it('should handle ErrorEvent errors while executing deleteUploadedFiles', (done: DoneFn) => {
    let logServiceSpy = spyOn<any>(logService, 'logError');
    logServiceSpy.and.returnValue('');
    let spyCalls = httpClientSpy.delete.calls.count();
    httpClientSpy.delete.and.returnValue(throwError(()=> new HttpErrorResponse({
      error: new ErrorEvent('404', {message: 'Not Found'}),
      status: 404
    })));
    productService.deleteUploadedFiles("").subscribe({
      next: done.fail,
      error: (errorMessage)=>{
        expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: Not Found');
        expect(errorMessage).toEqual(new Error('An error occurred. Please try again.'));
        expect(httpClientSpy.delete.calls.count()).toBe(spyCalls+1);
        done();
      }
    });
  });

  it('should handle text errors while executing deleteUploadedFiles', (done: DoneFn) => {
    let logServiceSpy = spyOn<any>(logService, 'logError');
    logServiceSpy.and.returnValue('');
    let spyCalls = httpClientSpy.delete.calls.count();
    httpClientSpy.delete.and.returnValue(throwError(()=> new HttpErrorResponse({
      error: 'A Text Error',
      status: 404
    })));
    productService.deleteUploadedFiles("").subscribe({
      next: done.fail,
      error: (errorMessage)=>{
        expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: status 404, A Text Error');
        expect(errorMessage).toEqual(new Error('An error occurred. Please try again.'));
        done();
      }
    });
    expect(httpClientSpy.delete.calls.count()).toBe(spyCalls+1);
  });

  //--- 6

  it('should process saveFileInfo', () => {
    spyOn(productService, 'saveFileInfo').and.returnValue(of({results: [{id: 123}, {id: 456}], status: '200 OK', statusText: 'SUCCESS'}));
    productService.saveFileInfo("","",1).subscribe((res: any) => {
      expect(res.status).toEqual('200 OK');
      expect(res.statusText).toEqual('SUCCESS');
      expect(res.results.length).toEqual(2);
    });
  });

  it('should process saveFileInfo through httpClient', (done: DoneFn) => {
    spyOn(productService, 'saveFileInfo').and.returnValue(of({results: [{id: 123}, {id: 456}], status: '200 OK', statusText: 'SUCCESS'}));
    productService.saveFileInfo("","",1).subscribe({
      next: (res: any) => {
        expect(res.status).toEqual('200 OK');
        expect(res.statusText).toEqual('SUCCESS');
        expect(res.results.length).toEqual(2);
        done();
      },
      error: done.fail
    });
  });

  it('should handle ErrorEvent errors while executing saveFileInfo', (done: DoneFn) => {
    let logServiceSpy = spyOn<any>(logService, 'logError');
    logServiceSpy.and.returnValue('');
    let spyCalls = httpClientSpy.post.calls.count();
    httpClientSpy.post.and.returnValue(throwError(()=> new HttpErrorResponse({
      error: new ErrorEvent('404', {message: 'Not Found'}),
      status: 404
    })));
    productService.saveFileInfo("","",1).subscribe({
      next: done.fail,
      error: (errorMessage)=>{
        expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: Not Found');
        expect(errorMessage).toEqual(new Error('An error occurred. Please try again.'));
        expect(httpClientSpy.post.calls.count()).toBe(spyCalls+1);
        done();
      }
    });
  });

  it('should handle text errors while executing saveFileInfo', (done: DoneFn) => {
    let logServiceSpy = spyOn<any>(logService, 'logError');
    logServiceSpy.and.returnValue('');
    let spyCalls = httpClientSpy.post.calls.count();
    httpClientSpy.post.and.returnValue(throwError(()=> new HttpErrorResponse({
      error: 'A Text Error',
      status: 404
    })));
    productService.saveFileInfo("","",1).subscribe({
      next: done.fail,
      error: (errorMessage)=>{
        expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: status 404, A Text Error');
        expect(errorMessage).toEqual(new Error('An error occurred. Please try again.'));
        done();
      }
    });
    expect(httpClientSpy.post.calls.count()).toBe(spyCalls+1);
  });

  //---7

  it('should process saveItem', () => {
    spyOn(productService, 'saveItem').and.returnValue(of({results: [{id: 123}, {id: 456}], status: '200 OK', statusText: 'SUCCESS'}));
    productService.saveItem({}).subscribe((res: any) => {
      expect(res.status).toEqual('200 OK');
      expect(res.statusText).toEqual('SUCCESS');
      expect(res.results.length).toEqual(2);
    });
  });

  it('should process saveItem through httpClient', (done: DoneFn) => {
    spyOn(productService, 'saveItem').and.returnValue(of({results: [{id: 123}, {id: 456}], status: '200 OK', statusText: 'SUCCESS'}));
    productService.saveItem({}).subscribe({
      next: (res: any) => {
        expect(res.status).toEqual('200 OK');
        expect(res.statusText).toEqual('SUCCESS');
        expect(res.results.length).toEqual(2);
        done();
      },
      error: done.fail
    });
  });

  it('should handle ErrorEvent errors while executing saveItem', (done: DoneFn) => {
    let logServiceSpy = spyOn<any>(logService, 'logError');
    logServiceSpy.and.returnValue('');
    let spyCalls = httpClientSpy.post.calls.count();
    httpClientSpy.post.and.returnValue(throwError(()=> new HttpErrorResponse({
      error: new ErrorEvent('404', {message: 'Not Found'}),
      status: 404
    })));
    productService.saveItem({}).subscribe({
      next: done.fail,
      error: (errorMessage)=>{
        expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: Not Found');
        expect(errorMessage).toEqual(new Error('An error occurred. Please try again.'));
        expect(httpClientSpy.post.calls.count()).toBe(spyCalls+1);
        done();
      }
    });
  });

  it('should handle text errors while executing saveItem', (done: DoneFn) => {
    let logServiceSpy = spyOn<any>(logService, 'logError');
    logServiceSpy.and.returnValue('');
    let spyCalls = httpClientSpy.post.calls.count();
    httpClientSpy.post.and.returnValue(throwError(()=> new HttpErrorResponse({
      error: 'A Text Error',
      status: 404
    })));
    productService.saveItem({}).subscribe({
      next: done.fail,
      error: (errorMessage)=>{
        expect(logServiceSpy).toHaveBeenCalledWith('An error occurred: status 404, A Text Error');
        expect(errorMessage).toEqual(new Error('An error occurred. Please try again.'));
        done();
      }
    });
    expect(httpClientSpy.post.calls.count()).toBe(spyCalls+1);
  });
  
});
