

export function objImmutableCopy(obj: object): object{
	if(!obj) return obj;
	return Object.assign({}, obj);
}

export function arrImmutableCopy(arr: object[]): object[]{
	if(!arr || arr.length <= 0) return arr;
	let res: object[] = [];
	arr.forEach((obj: object) => {
		res.push(objImmutableCopy(obj));
	});
	return res;
}

export function deepImmutableCopy(obj: any){
	if(!obj) return obj;
	return JSON.parse(JSON.stringify(obj));
}

export function parseFunc(func: any){
	if(func){
		if(typeof func == 'string' && (func.indexOf('function')>-1 || 
				func.indexOf('this')>-1 || func.indexOf('=>')>-1)){
			return eval(func);
		} else {
			return func;
		}
	}
}

export function getChildFieldCol(children: any[], matchKey: string): any{
	let found: any[] = children.columns.filter((column: any) => column.key == matchKey);
	return (found.length>0)? found[0] : null;
}

export function getChildFieldRowColumn(children: any[], matchKey: string): any{
	let found = {row: '', col: ''};
	children.forEach(child => {
		const column = getChildFieldCol(child, matchKey);
		(column)? found = {row: child, col: column} : null;
	});
	return found;
}



