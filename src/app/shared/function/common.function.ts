

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

