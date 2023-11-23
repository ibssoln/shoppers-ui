import { Component } from '@angular/core';
import { CartItemType, CartType, SessionData } from '../shared/model/SessionData.model';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SessionDataService } from '../service/session-data.service';
import { Item, Store } from '../shared/model/common.model';
import { APP } from '../shared/constant/app.const';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {

  public sessionData: SessionData = new SessionData();
  public cartForm: FormGroup = this.formBuilder.group({});
  public countShops: number = 0;
  public currentShop: Store = new Store();
  public currentCart: CartType = new CartType();
  public currentItems: CartItemType[] = [];
  public singleShopView: boolean = false;
  public loader: boolean = false;
 
  // prevent memory leak
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    // private itemService: ItemService,
    private sessionDataService: SessionDataService,
	// public router: Router,
	// private loggerService: LoggerService,
	// private datePipe: DatePipe,
	// private changeDetectorRef: ChangeDetectorRef
  ){
    // this.faqForm = this.formBuilder.group({
    //   keyword: new FormControl('')
    // });
  }

  ngOnInit(): void{
    this.loadSessionStoreInfo();
	  // this.storeForm.addControl('keyword', new FormControl('', [Validators.required]));
  }

  public loadSessionStoreInfo(){
    this.sessionData = this.sessionDataService.getSessionData();
    this.countShops = this.sessionData.carts.length;
    if (!this.singleShopView && this.countShops == 1){
        this.currentShop = this.sessionData.shop;
        this.currentCart = this.sessionData.carts.filter(cart => cart.store.id == this.currentShop.id)?.[0] ?? new CartType();
        this.currentItems = this.currentCart?.cartItems ?? [];
    }
  }

  public currentTotal(): number{
    let total: number = 0;
    this.currentItems.forEach(basket => {total += Number(basket.item.price);});
    return total;
  }

  public showSingleViewCart(selectedCart: CartType){
    console.log('showSingleViewCart name = '+selectedCart.store);
    this.currentShop = selectedCart.store;
    this.currentCart = selectedCart;
    this.currentItems = this.currentCart?.cartItems ?? [];
    this.singleShopView = true;
  }

  public seeAllShopsCart(){
    console.log('seeAllShopsCart');
    this.currentShop = new Store();
    this.currentCart = new CartType();
    this.currentItems = [];
    this.singleShopView = false;
  }

  ngOnDestroy(): void{
    this.destroy$.next();
    this.destroy$.complete();
    console.error('destroy');
  }

}