import { Subject } from "rxjs";
import { DatagridRefreshMode, DatagridRepository } from "./repository.model";
import { ClrDatagridSortOrder } from '@clr/angular';

export class FaqDatagrid{
	repository: DatagridRepository<faq> = new DatagridRepository();
	refreshMode: DatagridRefreshMode = DatagridRefreshMode.Normal;
	currentPage: number = 1;
	numItemsPerPage: number = 10;
	hasAllDataAlreadyFetched = false;
	allDataStatic: faq[] = [];
	debouncer = new Subject<any>();
	sorts: FaqSort = new FaqSort();
	filters: FaqFilter = new FaqFilter();
	selections: FaqSelection = new FaqSelection
	constructor(){};
}

export class FaqSort{
	levelName: ClrDatagridSortOrder = 0;
	businessId: ClrDatagridSortOrder = 0;
	editTime: ClrDatagridSortOrder = 0;
	constructor(){};
	[key: string]: any;
}

export class FaqFilter{
	levelName: string = '';
	businessId: string = '';
	editTime: string = '';
	constructor(){};
	[key: string]: any;
}

export class FaqSelection{
	public itemsSelected: faq[] = [];
	public selectionsBeforeFetch: faq[] = [];
	constructor(){};
}

export enum FaqMode{
	NoData,
	TimeOut
}

export class FaqNotification{
	msgNoData: boolean = false;
	msgTimeOut: boolean = false;
	msgOpComplete: boolean = false;
	constructor(){}
}

export class FaqSpinner{
	searching: boolean = false;
	allFetching: boolean = false;
	enableSearch: boolean = true;
	processing: boolean = false;
	constructor(){}
}

export enum FaqNotificationMode{
	NoData,
	TimeOut
}

export class faq{
	compositeKey: string = ''; //programmable
	levelName: string = '';
	businessId: string = '';
	editTime: string = '';
	selected: boolean = false; //programmable
	description: string = ''; //programmable
	constructor(){};
}