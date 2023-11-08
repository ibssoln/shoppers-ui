import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Item, Store } from '../shared/model/common.model';
import { ItemService } from '../service/item/item.service';
import { APP } from '../shared/constant/app.const';
import { SessionDataService } from '../service/session/session-data.service';
import { CartItemType, CartType, SessionData } from '../shared/model/SessionData.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-best-deal',
  templateUrl: './best-deal.component.html',
  styleUrls: ['./best-deal.component.css']
})
export class BestDealComponent {

  public sessionData: SessionData = new SessionData();
  public dealForm: FormGroup = this.formBuilder.group({});
  public currentShop: Store = new Store();
  public items: Item[] = [];
  public loader: boolean = false;
 
  // prevent memory leak
  private destroy$: Subject<void> = new Subject<void>();


  constructor(
    private formBuilder: FormBuilder,
    private itemService: ItemService,
    private sessionDataService: SessionDataService,
	  private router: Router,
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
    this.getSpecialDealItems();
	  // this.storeForm.addControl('keyword', new FormControl('', [Validators.required]));
  }

  public loadSessionStoreInfo(){
    this.sessionData = this.sessionDataService.getSessionData();
    this.currentShop = Store.build('999999', 'Best Deal Online Store');
  }

  public getSpecialDealItems(){
    this.loader = true;
    this.itemService.getSpecialDealItems().pipe(takeUntil(this.destroy$)).subscribe({next: (respone: Item[]) => {
      if(respone){
        respone.forEach((item: Item) => {item.image = APP.ENDPOINT.SERVER+'/'+item.image;});
        this.items = respone;
        console.log('items = '+JSON.stringify(this.items));
      }
      this.loader = false;
    }, error: (err: any) => {
      this.loader = false;
      // this.logger.logError("An error occurred while getting special deal items. ${err}");
    }});
  }

  public addToCart(item: Item){
    let carts: CartType[] = this.sessionData.carts.filter(cart => (cart.store.id == this.currentShop.id));
    if(carts[0]){
      carts[0].cartItems.push(CartItemType.build(item, 1, new Date()));
    }else{
      let newCart = CartType.build(this.currentShop, [CartItemType.build(item, 1, new Date())]);
      this.sessionData.carts.push(newCart);
    }
    console.log('cart = '+JSON.stringify(this.sessionData.carts));
    let sessionData = this.sessionDataService.getSessionData();
    sessionData.shop = this.currentShop;
    this.router.navigate(['/cart']);
  }

  ngOnDestroy(): void{
    this.destroy$.next();
    this.destroy$.complete();
  }

}

