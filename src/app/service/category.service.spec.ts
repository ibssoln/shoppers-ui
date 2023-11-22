import { TestBed } from '@angular/core/testing';

import { CategoryService } from './category.service';
import { HttpClient } from '@angular/common/http';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj('HttpClient', ['get']);

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
            CategoryService,
            { provide: HttpClient, useValue: httpClientSpy}
        ]
    });
    categoryService = TestBed.inject(CategoryService);

  });

  it('should be created', () => {
    expect(categoryService).toBeTruthy();
  });

});
