export class FaqDatagrid{
	repository: DatagridRepository<faq> = new DatagridRepository();
	refreshMode: DatagridRefreshMode = DataGridRefreshMode.Normal;
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