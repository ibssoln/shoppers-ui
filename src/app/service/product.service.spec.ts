import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import { LogService } from './log.service';
import { HttpClient } from '@angular/common/http';

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
  
});
