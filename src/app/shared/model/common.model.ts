export class Store{
    id: string = '';
    name: string = '';
    image: string = '';
    openUntil: Date | any = new Date();
    registeredAt: Date | any = new Date();
    address: string = '';
    constructor(){};
    static build(id: string, name: string){
		let obj = new Store();
		obj.id = id;
		obj.name = name;
		return obj;
	}
}

export class Category{
    id: string = '';
    name: string = '';
    image: string = '';
}

export class Item{
    id: string = '';
    name: string = '';
    price: string = '';
    vendor: Vendor = new Vendor();
    specialDeal: string = '';
    image: string = '';
    weight: string = '';
    event: Event | any = new Event();
}

export class Vendor{
    id: string = '';
    name: string = '';
    address: string = '';
    factoryLoc: string = '';
}

export class Event{
    id: string = '';
    name: string = '';
    start_date: Date | any = new Date();
    end_date: Date | any = new Date();
}