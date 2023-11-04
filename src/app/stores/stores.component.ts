import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ControllerService } from '../service/controller/controller.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css']
})
export class StoresComponent {

  public storeForm: FormGroup = this.formBuilder.group({});

  // prevent memory leak
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private controllerService: ControllerService,
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
	  // this.storeForm.addControl('keyword', new FormControl('', [Validators.required]));
  }



  ngOnDestroy(): void{
    this.destroy$.next();
    this.destroy$.complete();
   }

}
