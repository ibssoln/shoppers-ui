import { Item, Store } from "./common.model";

export class SessionData{
	authentication: AuthcType = new AuthcType();
	authorization: AuthrType = new AuthrType();
	shop: Store = new Store();
	item: ItemType = new ItemType();
	carts: CartType[] = [];
	status: StatusType = new StatusType();
	uiState: uiStateType = new uiStateType();	
}

export class CartType{
	store: Store = new Store();
	cartItems: CartItemType[] = [];
	constructor(){};
	static build(store: Store, cartItems: CartItemType[]){
		let obj = new CartType();
		obj.store = store;
		obj.cartItems = cartItems;
		return obj;
	}
}

export class CartItemType{
	item: Item = new Item();
	count: number = 0;
	loadedAt: Date | any = new Date();
	constructor(){};
	static build(item: Item, count: number, loadedAt: Date){
		let obj = new CartItemType();
		obj.item = item;
		obj.count = count;
		obj.loadedAt = loadedAt;
		return obj;
	}
}

export class ItemType{
    itemType: string = '';
}

export class StatusType{
    statusType: string = '';
}

export class AuthcType{
	userId: string = '';
	firstName: string = '';
	lastName: string = '';
	sessionId: string = '';
	constructor(){}
	public setIdName(id: string, firstName: string, lastName: string){
		this.userId = id;
		this.firstName = firstName;
		this.lastName = lastName;
	}
}

export class AuthrType{
	userId: string = '';
	activeRole: FortressRoleType = new FortressRoleType();
	activePolicies: PolicyType[] = [];
	constructor(){};
	static build(userId: string, activeRole: FortressRoleType, activePolicies: []){
		let obj = new AuthrType();
		obj.userId = userId;
		obj.activeRole = activeRole;
		obj.activePolicies = activePolicies;
		return obj;
	}
}

export class FortressRoleType{
	role: string = '';
	context: FortressRoleContext[] = [];
}

export class FortressRoleContext{
	contextId: string = '';
	contextList: string[] = [];
}

export class PolicyType{
	code: string = '';
	name: string = '';
	group: string = '';
	constructor(){};
	static build(code: string, name: string, group: string){
		let obj = new PolicyType();
		obj.code = code;
		obj.name = name;
		obj.group = group;
		return obj;
	}
}

export class uiStateType{
	shops: any[] = [];
	items: any[] = [];
	shopId: string = '';
	itemId: string = '';
	reloadRequired: boolean = false;
	isCopyNotSaved: boolean = false;
	constructor(){};
	static buildReloadRequired(reloadRequired: boolean): uiStateType{
		let obj = new uiStateType();
		obj.reloadRequired = reloadRequired;
		return obj;
	}
	static buildWithCopyFlag(isCopyNotSaved: boolean): uiStateType{
		let obj = new uiStateType();
		obj.isCopyNotSaved = isCopyNotSaved;
		return obj;
	}
}

export class archiveReadyToSaveSessionData{
	save: boolean = false;
	content: CONTENT_TYPE = CONTENT_TYPE.NONE;
	redirectUrl: any = [];
	static build(save: boolean, content: CONTENT_TYPE, redirectUrl: any){
		let obj = new archiveReadyToSaveSessionData();
		obj.save = save;
		obj.content = content;
		obj.redirectUrl = redirectUrl;
		return obj;
	}
}

export enum CONTENT_TYPE{
	NONE = 0,
	ITEMS = 1,
	SHOPS = 2,
	CART = 3,
	FAQ = 4,
	SETTING = 5
}

