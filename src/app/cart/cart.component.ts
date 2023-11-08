import { Component } from '@angular/core';
import { CartItemType, CartType, SessionData } from '../shared/model/SessionData.model';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SessionDataService } from '../service/session/session-data.service';
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
  public currentShop: Store = new Store();
  public currentCart: CartType = new CartType();
  public currentItems: CartItemType[] = [];
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
    this.currentShop = this.sessionData.shop;
    this.currentCart = this.sessionData.carts.filter(cart => cart.store.id == this.currentShop.id)?.[0] ?? new CartType();
    this.currentItems = this.currentCart?.cartItems ?? [];
  }

  ngOnDestroy(): void{
    this.destroy$.next();
    this.destroy$.complete();
  }

}