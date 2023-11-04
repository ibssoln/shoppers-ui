import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ControllerService } from '../service/controller/controller.service';
import { Subject, takeUntil } from 'rxjs';
import { StoreService } from '../service/store/store.service';
import { Store } from '../shared/model/common.model';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css']
})
export class StoresComponent {

  public storeForm: FormGroup = this.formBuilder.group({});
  public stores: Store[] = [];
  public loader: boolean = false;
 
  // prevent memory leak
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private storeService: StoreService,
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
    this.getStores();
	  // this.storeForm.addControl('keyword', new FormControl('', [Validators.required]));
  }

  public getStores(){
    this.loader = true;
    this.storeService.getStores().pipe(takeUntil(this.destroy$)).subscribe({next: (respone: Store[]) => {
      if(respone){
        this.stores = respone;
        console.log('stores = '+JSON.stringify(this.stores));
      }
      this.loader = false;
    }, error: (err: any) => {
      this.loader = false;
      // this.logger.logError("An error occurred while getting data. ${err}");
    }});
  }

  ngOnDestroy(): void{
    this.destroy$.next();
    this.destroy$.complete();
   }

}
