import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Item } from '../shared/model/common.model';
import { ItemService } from '../service/item/item.service';
import { APP } from '../shared/constant/app.const';

@Component({
  selector: 'app-best-deal',
  templateUrl: './best-deal.component.html',
  styleUrls: ['./best-deal.component.css']
})
export class BestDealComponent {

  public storeForm: FormGroup = this.formBuilder.group({});
  public items: Item[] = [];
  public loader: boolean = false;
 
  // prevent memory leak
  private destroy$: Subject<void> = new Subject<void>();


  constructor(
    private formBuilder: FormBuilder,
    private itemService: ItemService,
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
    this.getSpecialDealItems();
	  // this.storeForm.addControl('keyword', new FormControl('', [Validators.required]));
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

  ngOnDestroy(): void{
    this.destroy$.next();
    this.destroy$.complete();
  }

}
