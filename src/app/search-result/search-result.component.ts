import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, TimeoutError, debounceTime, takeUntil } from 'rxjs';
import { FaqDatagrid, FaqFilter, FaqNotification, FaqNotificationMode, FaqSort, FaqSpinner, faq } from '../shared/datagrid/faq.datagrid.model';
import { ClrDatagridSortOrder, ClrDatagridStateInterface } from '@clr/angular';
import { DatagridRefreshMode, FetchResult } from '../shared/datagrid/repository.model';
import { ControllerService } from '../service/controller.service';


@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit, OnDestroy{

  public searchForm: FormGroup = this.formBuilder.group({});
  // public isShowTable = false;
  // public displayModal: boolean = false;
  // public itemsDataGrid: faq[] = []; //data grid items
  // public numItemsTotal: number = 0; // data grid items total
  // public itemsSelected: faq[] = [];
  // public faqSpinner: FaqSpinner = new FaqSpinner();
  // public faqNotification: FaqNotification = new FaqNotification();
  // public faqDatagrid: FaqDatagrid = new FaqDatagrid();
  // public numItemsProcessed: number = 0;

  // prevent memory leak
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
  ){
    // this.faqForm = this.formBuilder.group({
    //   keyword: new FormControl('')
    // });
  }

  ngOnInit(): void{
	  this.searchForm.addControl('keyword', new FormControl('', [Validators.required]));
  }

  public search(){

  }


  ngOnDestroy(): void{
    this.destroy$.next();
    this.destroy$.complete();
  }

}