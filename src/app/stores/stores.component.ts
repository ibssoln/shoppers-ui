import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ControllerService } from '../service/controller/controller.service';
import { Subject, map, takeUntil } from 'rxjs';
import { StoreService } from '../service/store/store.service';
import { Category, Store } from '../shared/model/common.model';
import { APP } from '../shared/constant/app.const';
import { CategoryService } from '../service/category/category.service';
import { Router } from '@angular/router';
import { SessionDataService } from '../service/session/session-data.service';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css']
})
export class StoresComponent {

  public storeForm: FormGroup = this.formBuilder.group({});
  public stores: Store[] = [];
  public categories: Category[] = [];
  public loader: boolean = false;
 
  // prevent memory leak
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private categoryService: CategoryService,
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
    this.getCategories();
    this.getStores();
	  // this.storeForm.addControl('keyword', new FormControl('', [Validators.required]));
  }

  public getCategories(){
    this.loader = true;
    this.categoryService.getCategories().pipe(takeUntil(this.destroy$)).subscribe({next: (response: Category[]) => {
      if(response){
        response.forEach((category: Category) => {category.image = APP.ENDPOINT.SERVER+'/'+category.image;});
        this.categories = response;
        console.log('categories = '+JSON.stringify(this.categories));
      }
      this.loader = false;
    }, error: (err: any) => {
      this.loader = false;
      // this.logger.logError("An error occurred while getting data. ${err}");
    }});
  }

  public getStores(){
    this.loader = true;
    this.storeService.getStores().pipe(takeUntil(this.destroy$)).subscribe({next: (respone: Store[]) => {
      if(respone){
        respone.forEach((store: Store) => {store.image = APP.ENDPOINT.SERVER+'/'+store.image;});
        this.stores = respone;
        console.log('stores = '+JSON.stringify(this.stores));
        console.log('date time = '+new Date());
      }
      this.loader = false;
    }, error: (err: any) => {
      this.loader = false;
      // this.logger.logError("An error occurred while getting data. ${err}");
    }});
  }

  public goToShop(store: Store){
    let sessionData = this.sessionDataService.getSessionData();
    sessionData.shop.shopId = store.id;
    sessionData.shop.shopName = store.name;
    this.router.navigate(['/shop']);
  }

  ngOnDestroy(): void{
    this.destroy$.next();
    this.destroy$.complete();
   }

}
