import { Component } from '@angular/core';
import { Item, Store } from '../shared/model/common.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ItemService } from '../service/item/item.service';
import { Router } from '@angular/router';
import { APP } from '../shared/constant/app.const';
import { SessionDataService } from '../service/session/session-data.service';
import { ShopType } from '../shared/model/SessionData.model';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent {

  public shopForm: FormGroup = this.formBuilder.group({});
  public currentShop: ShopType = new ShopType();
  public items: Item[] = [];
  public loader: boolean = false;
 
  // prevent memory leak
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private itemService: ItemService,
	  private router: Router,
    private sessionDataService: SessionDataService,
	// private loggerService: LoggerService,
	// private datePipe: DatePipe,
	// private changeDetectorRef: ChangeDetectorRef
  ){
    // this.faqForm = this.formBuilder.group({
    //   keyword: new FormControl('')
    // });
  }

  ngOnInit(): void{
    this.loadStoreInfo();
    this.getItemsByShop();
	  // this.storeForm.addControl('keyword', new FormControl('', [Validators.required]));
  }

  public loadStoreInfo(){
    let sessionData = this.sessionDataService.getSessionData();
    this.currentShop = sessionData.shop;
  }

  public getItemsByShop(){
    this.loader = true;
    this.itemService.getItemsByShop(this.currentShop.shopId).pipe(takeUntil(this.destroy$)).subscribe({next: (response: Item[]) => {
      if(response){
        response.forEach((item: Item) => {item.image = APP.ENDPOINT.SERVER+'/'+item.image;});
        this.items = response;
        console.log('items = '+JSON.stringify(this.items));
      }
      this.loader = false;
    }, error: (err: any) => {
      this.loader = false;
      // this.logger.logError("An error occurred while getting items. ${err}");
    }});
  }

  ngOnDestroy(): void{
    this.destroy$.next();
    this.destroy$.complete();
   }

}

