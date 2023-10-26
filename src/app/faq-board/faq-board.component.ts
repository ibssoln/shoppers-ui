import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, TimeoutError, debounceTime, takeUntil } from 'rxjs';
import { FaqDatagrid, FaqFilter, FaqNotification, FaqNotificationMode, FaqSort, FaqSpinner, faq } from '../shared/datamodel/faq.datagrid.model';
import { ClrDatagridSortOrder, ClrDatagridStateInterface } from '@clr/angular';
import { DatagridRefreshMode, FetchResult } from '../shared/datamodel/repository.model';
import { ControllerService } from '../service/controller/controller.service';

@Component({
  selector: 'app-faq-board',
  templateUrl: './faq-board.component.html',
  styleUrls: ['./faq-board.component.css']
})
export class FaqBoardComponent implements OnInit, OnDestroy{

  public faqForm: FormGroup = this.formBuilder.group({});
  public isShowTable = false;
  public displayModal: boolean = false;
  public itemsDataGrid: faq[] = []; //data grid items
  public numItemsTotal: number = 0; // data grid items total
  public itemsSelected: faq[] = [];
  public faqSpinner: FaqSpinner = new FaqSpinner();
  public faqNotification: FaqNotification = new FaqNotification();
  public faqDatagrid: FaqDatagrid = new FaqDatagrid();
  public numItemsProcessed: number = 0;

  // public businessIdNameList: string[] = [];
  // private searchSubmitterId: string = '';
  // public levels: Level[] = [];
  // private userRoleTypes: string[] = [];


  // prevent memory leak
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private controllerService: ControllerService
  ){
    // this.faqForm = this.formBuilder.group({
    //   keyword: new FormControl('')
    // });
  }

  ngOnInit(): void{
    this.refreshDatagrid();
	this.faqForm.addControl('keyword', new FormControl('', [Validators.required]));
  }

  public searchDisplayInitialPage(){
    // this.setSearchUserIdCriteria();
    this.changeStateShowTable(false);
    this.setSearchingMode(true);
    this.prepareNewCriteriaSearch();
    this.loadSearchDataToTable();
  }

  private prepareNewCriteriaSearch(){
    this.setSorts(true, this.faqDatagrid.sorts);
    this.setFilters(true, this.faqDatagrid.filters);
    this.faqDatagrid.hasAllDataAlreadyFetched = false;
    this.faqDatagrid.allDataStatic = [];
    this.faqDatagrid.selections.itemsSelected = [];
    this.faqDatagrid.currentPage = 1; //reset to page 1
    this.faqDatagrid.numItemsPerPage = 10;
  }

 private refreshDatagrid(): void{
  
  this.faqDatagrid.debouncer.asObservable().pipe(debounceTime(500))
	.pipe(takeUntil(this.destroy$)).subscribe((state: ClrDatagridStateInterface) => {

	const prevNumItemsPerPage: number = this.faqDatagrid.numItemsPerPage;
	if(!state.page){
		state.page = {
			from: 0,
			to: (this.faqDatagrid.numItemsPerPage-1),
			size: this.faqDatagrid.numItemsPerPage,
		};
	}
	this.faqDatagrid.numItemsPerPage = (state.page.size)? state.page.size: this.faqDatagrid.numItemsPerPage;

	//==============
	if(this.faqDatagrid.refreshMode == DatagridRefreshMode.SkipEventAtInitRendering){
		this.faqDatagrid.refreshMode = DatagridRefreshMode.Normal;
		state.filters = [];
		state.sort = undefined;
	}else{
		type typeFilter = {property: string, value: string};
		let filterMap: Map<string, string[]> = new Map<string, string[]>();
		if(state.filters){
			for(const filter of state.filters){
				const { property, value } = <typeFilter>filter;
				filterMap.set(property, [value]);
			}
		}
		//----------------
		if(this.faqDatagrid.hasAllDataAlreadyFetched){
			this.faqDatagrid.selections.selectionsBeforeFetch = this.itemsDataGrid.slice();
			this.faqDatagrid.selections.selectionsBeforeFetch.forEach(item => {
				const found: faq | undefined
					= this.findOne(this.faqDatagrid.allDataStatic, item.compositeKey);
				if(found){
					found.selected = item.selected;
				}
			});
			this.faqDatagrid.selections.selectionsBeforeFetch = [];

			// apply filter, sort, pagination criteria
			this.faqDatagrid.repository.setAllData(this.faqDatagrid.allDataStatic)
			.filter(filterMap)
			.sort(<{by: string; reverse: boolean}>state.sort)
			.fetch(state.page!.from, this.faqDatagrid.numItemsPerPage)
			.then((fetchResult: FetchResult) => {
				this.changeStateShowTable(true);
				this.itemsDataGrid = <faq[]> fetchResult.result;
				// this.setUserInfo();
				this.numItemsTotal = fetchResult.total;

				// recalculate the itemsSelected based on the updated allDataStatic repo.
				this.faqDatagrid.selections.itemsSelected = [];
				this.faqDatagrid.allDataStatic.forEach(data => {
					if(data.selected){ // apply only the selected ones.
						//if not already in there, then add.
						const found: faq | undefined
							= this.findOne(this.faqDatagrid.selections.itemsSelected, data.compositeKey);
						if(!found){
							this.faqDatagrid.selections.itemsSelected.push(data);
						}
					}
				});

			}).catch((err: any) => {
				// this.loggerService.logError(`Error occurred while refreshing data: ${err}`);
			});
		
		//----------------
		}else{
		//----------------
			// triggered only when (1) a new criteria search is not under progress, (2) a sort or a filter criteria exists,
			// (3) other page than the first page is requested, or (4) previous numItemsPerPage is different from the current numItemsPerPge.
			if((!this.faqSpinner.searching) && (state) && (
				(state.sort && state.sort?.by)
				|| (state.filters && (state.filters?.length > 0))
				|| ((state.page!.from) && (state.page!.from >= this.faqDatagrid.numItemsPerPage))
				|| (prevNumItemsPerPage != this.faqDatagrid.numItemsPerPage)
			)){
				//carry-over the selections (1)
				this.faqDatagrid.selections.selectionsBeforeFetch = this.itemsDataGrid.slice();

				this.setAllFetchingMode(true);

				//feed the sort & filter criteria
				this.setSorts(false, this.faqDatagrid.sorts, state);
				this.setFilters(false, this.faqDatagrid.filters, filterMap);

				// fetch all data first.
				this.fetchAllData().then((fetchResult: FetchResult) => {
					// keep all data in the static storage for a later pagination & sorting & filtering, 
					// in order to prevent a redundant fetching for all data.
					this.faqDatagrid.allDataStatic = <faq[]> fetchResult.result.slice();

					// carry over the selections (2)
					this.faqDatagrid.selections.selectionsBeforeFetch.forEach(item => {
						const found: faq | undefined = this.findOne(this.faqDatagrid.allDataStatic, item.compositeKey);
						if(found){
							found.selected = item.selected;
						}
					});	
					this.faqDatagrid.selections.selectionsBeforeFetch = [];

					// apply filter, sort, pagination criteria
					this.faqDatagrid.repository.setAllData(this.faqDatagrid.allDataStatic)
					.filter(filterMap)
					.sort(<{ by: string; reverse: boolean }>state.sort)
					.fetch(state.page!.from, this.faqDatagrid.numItemsPerPage)
					.then((fetchResult: FetchResult) => {
						
						this.changeStateShowTable(true);
						this.itemsDataGrid = <faq[]> fetchResult.result;
						// this.setUserInfo();
						this.numItemsTotal = fetchResult.total;

						// recalculate the itemsSelected based on the updated allDataStatic repo.
						this.faqDatagrid.selections.itemsSelected = [];
						this.faqDatagrid.allDataStatic.forEach(data => {
							if(data.selected){ //only the selected ones.
								//if not already in there, then add.
								const found: faq | undefined 
								= this.findOne(this.faqDatagrid.selections.itemsSelected, data.compositeKey);
								if(!found){
									this.faqDatagrid.selections.itemsSelected.push(data);
								}
							}

						});

					});
					this.faqDatagrid.hasAllDataAlreadyFetched = true;
					this.setAllFetchingMode(false);			
	
				}).catch((err: any) => {
					// this.loggerService.logError(`Error occurred while refreshing data: ${err}`);
				});

			}
			
		}
		//----------------
	}
	//==============

    this.setSearchingMode(false);
  });
 }  

 private loadSearchDataToTable(){
	
	this.controllerService.getData()
	.pipe(takeUntil(this.destroy$))
	.subscribe((resp: any) => {

		if(resp.data && resp.total > 0){
			this.changeStateShowTable(true);
			this.itemsDataGrid = resp.data.sort((a: any, b: any) => a.editTime < b.editTime ? 1 : a.editTime > b.editTime? -1 : 0);
			// this.setUserInfo();
			this.numItemsTotal = resp.total;
		}else{
			this.changeStateShowTable(false);
			this.handleAlertMessage(FaqNotificationMode.NoData);
		}

	}, (err: any) => {
		if(err instanceof TimeoutError){
			this.handleAlertMessage(FaqNotificationMode.TimeOut);
			// this.loggerService.logError(`Timeout error occurred while loading data: ${err}`);
		}else{
			// this.loggerService.logError(`Error occurred while loading data: ${err}`);
		}
	});

}

private handleAlertMessage(mode: FaqNotificationMode){
	if(mode == FaqNotificationMode.NoData){
		this.faqNotification.msgNoData = true;
	}else if(mode == FaqNotificationMode.TimeOut){
		this.faqNotification.msgTimeOut = true;
	}
	this.resetButtonAndSpinner();
}

private resetButtonAndSpinner(){
	this.faqSpinner.enableSearch = true;
	this.faqSpinner.searching = false;
	this.faqSpinner.allFetching = false;
}

public refresh(state: ClrDatagridStateInterface){
	this.faqDatagrid.debouncer.next(state);
}

private changeStateShowTable(toState: boolean){
	let fromState: boolean = this.isShowTable;
	if(( ! fromState ) && toState){
		this.faqDatagrid.refreshMode = DatagridRefreshMode.SkipEventAtInitRendering;
	}else{
		this.faqDatagrid.refreshMode = DatagridRefreshMode.Normal;
	}
	this.isShowTable = toState;
}

private async fetchAllData(): Promise<FetchResult>{

	return await new Promise((resolve, reject) => {
		this.controllerService.getData()
		.pipe(takeUntil(this.destroy$))
		.subscribe((resp: any) => {
			if(resp){
				const fetchResult: FetchResult = <FetchResult> {result: resp.data, total: resp.total};
				resolve(fetchResult);
			}

		}, (err: any)=> {
			// this.loggerService.logError(`Error occurred while fetching all data: ${err}`);
			reject(err);
		})
	});

}

 private setSorts(initialize: boolean, sortObj: FaqSort, state?: ClrDatagridStateInterface){
	for(let key of (Object.keys(sortObj) as Array<keyof FaqSort>)){
		sortObj[key] = 0; //default when initialization is requested.
		if((! initialize) && (state) && (state.sort?.by == key.toString()) ){
			sortObj[key] = (state.sort.reverse)? ClrDatagridSortOrder.DESC : ClrDatagridSortOrder.ASC;
		}
	}
}

private setSearchingMode(turnOn: boolean){
	if(turnOn){
		this.resetErrMsg();
		this.hideEmptyDatagrid();
		this.faqSpinner.allFetching = ! turnOn;
	}
	this.faqSpinner.searching = turnOn;
}

private resetErrMsg(){
	this.faqNotification.msgNoData = false;
	this.faqNotification.msgTimeOut = false;
}

private setAllFetchingMode(turnOn: boolean){
	if(turnOn){
		this.hideEmptyDatagrid();
	}
	this.faqSpinner.allFetching = turnOn;
	this.faqSpinner.enableSearch = ! turnOn;
}

private hideEmptyDatagrid(){
	this.changeStateShowTable(false);
	this.itemsDataGrid = [];
	this.numItemsTotal = 0;
}

private findOne(items: faq[], key: string): faq | undefined {
	let found: faq | undefined;
	let i: number = 0;
	for(i = 0; i < items.length; i ++){
		const item: faq = items[i];
		if(item.compositeKey == key){
			found = item;
			break;
		}
	}
	return found;
}

public isSearchOrFetchMode(){
	return (this.faqSpinner.searching || this.faqSpinner.allFetching);
}

public selectionChanged(items: faq[]){
	
	// the items passed as a parameter in here by the triggerred selectionChanged() event, is the results automatically
	// updated by Clarity API, and they store ONLY the items on which a select or deselect event was triggerred in the
	// viewport. therefore, if html is not configured properly, then it can (1) include the same item multiple times,
	// or (2) a deselect event is perceived as a select event (ie., the deselected item is included in the list as if
	// it was selected). therefore, html configuration should not be modified for this logic to work properly. 
	// also, see the logic inside the function named refreshDatagrid(), with which this algorithm works complementing each other.

	// update the flag using the triggerred event.
	this.itemsDataGrid.forEach(item => {
		const found: faq | undefined = this.findOne(items, item.compositeKey);
		if(found){
			item.selected = true;
		}else{
			item.selected = false;
		}
	});

	// to recalculate the items, empty out. (note: clarity design has a glitch, and this is the fix.)
	this.faqDatagrid.selections.itemsSelected = [];

	// bring from the current working items (which are not yet in the repo).
	this.itemsDataGrid.forEach(item => {
		if(item.selected){
			//if not already in there, then add.
			const found: faq | undefined
			= this.findOne(this.faqDatagrid.selections.itemsSelected, item.compositeKey);
			if(! found){
				this.faqDatagrid.selections.itemsSelected.push(item);
			}
		}else{
			// if already in there, then remove
			this.faqDatagrid.selections.itemsSelected.forEach((data, i) => {
				if(data.compositeKey == item.compositeKey){
					// if exist, then remove.
					this.faqDatagrid.selections.itemsSelected.splice(i, 1);
				}
			});
		}

	});

	// bring all the selected items outside the current page, from the repo.
	if(this.faqDatagrid.hasAllDataAlreadyFetched){
		this.faqDatagrid.allDataStatic.forEach(data => {
			if(data.selected){
					const found: faq | undefined 
					= this.findOne(this.itemsDataGrid, data.compositeKey);
					if(! found){
						this.faqDatagrid.selections.itemsSelected.push(data);
					}
			}
		});
	}
}

private setFilters(initialize: boolean, filterObj: FaqFilter, filterMap?: Map<string, string[]>){
	const objectKeys = Object.keys(filterObj) as Array<keyof FaqFilter>;
	for(let key of objectKeys){
		filterObj[key] = ''; // default when initialization is requested.
		if((! initialize) && filterMap){
			let values: string[] | undefined = filterMap.get(key.toString());
			filterObj[key] = values? values[0]:'';
		}
	}
}

 ngOnDestroy(): void{
	this.destroy$.next();
	this.destroy$.complete();
 }

}
