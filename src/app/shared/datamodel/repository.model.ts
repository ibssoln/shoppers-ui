export class DatagridRepository<T>{

	private allData: T[] = [];
	
    private procData: T[] | undefined = undefined;

	constructor(){}

	public setAllData(allData: T[]): DatagridRepository<T>{
		this.allData = allData;
		return this;
	}

	private getAllData(): T[]{
		return this.allData.slice();
	}

	private prepareProcData(): void{
		if(! this.procData){
			this.procData = this.allData.slice();
		}
	}

	public filter(filterMap: Map<string, string[]>): DatagridRepository<T>{
		this.prepareProcData();
		if(filterMap){
			filterMap.forEach((values: string[], key: string, map: Map<string, string[]>) => {
				const lookups = values.map(value => value.toLowerCase());							
                this.procData = this.procData?.filter((data: {[key: string]: any}) => {
					for(const lookup of lookups){
						if(data[key].toLowerCase().indexOf(lookup) >= 0){
							return true;
						}
					}
					return false;
				});

			});
		}
	return this;
	}

	public sort(sort: { by: string, reverse: boolean }): DatagridRepository<T>{
		this.prepareProcData();
		if(sort && sort.by){
			let getSortProperty = (data: {[key: string]: any}) => data[sort.by];
			this.procData?.sort((s1, s2) => {
				let result = 0;
				const s1Val = getSortProperty(s1), s2Val = getSortProperty(s2);
				if(s1Val < s2Val){
					result = -1;
				}else if (s1Val > s2Val) {
					result = 1;
				}
				if(sort.reverse){
					result = -result;
				}
				return result;
			});
		}
		return this;
	}

	public fetch(start: number = 0, count: number): Promise<FetchResult>{
		let fetchResult: FetchResult = new FetchResult();
		if(this.procData){
			const items = JSON.stringify(this.procData.slice(start, start + count));
			fetchResult = {result: JSON.parse(items), total: this.procData.length };

			this.allData = [];
			this.procData = undefined;
		}
		return Promise.resolve(fetchResult);
	}

}

type T = { [key: string]: any; };

export class FetchResult{
	result: T[] = [];
	total: number = 0;
	constructor(){}
}

export enum DatagridRefreshMode {
	Normal,
	SkipEventAtInitRendering
}







