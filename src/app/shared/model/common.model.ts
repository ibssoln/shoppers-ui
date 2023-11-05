export class Store{
    id: string = '';
    name: string = '';
    image: string = '';
    openUntil: Date = new Date();
    registeredAt: Date = new Date();
    address: string = '';
    constructor(){};
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
}

export class Vendor{
    id: string = '';
    name: string = '';
    address: string = '';
    factoryLoc: string = '';
}