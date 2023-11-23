import { Component } from '@angular/core';
import { ControllerService } from './service/controller.service';
// import { ClarityIcons, shoppingCartIcon, searchIcon, cogIcon, happyFaceIcon, storeIcon, pinboardIcon } from '@cds/core/icon';
import { Observable, Subject, catchError, takeUntil, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

// ClarityIcons.addIcons(shoppingCartIcon, searchIcon, cogIcon, happyFaceIcon, storeIcon, pinboardIcon );

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

 public title = 'shoppers-ui';
 public data: string[] = [];
 public loader: boolean = false;

 private destroy$: Subject<void> = new Subject<void>();

 constructor(
  private controllerService: ControllerService,
  private httpClient: HttpClient
 ){}

  // public getData(){
  //   this.controllerService.getData().pipe(takeUntil(this.destroy$)).subscribe({next: (respone: any) => {
  //     if(respone){
  //       this.data = respone;
  //       console.log('data = '+this.data);
  //     }
  //     this.loader = false;
  //   }, error: (err: any) => {
  //     this.loader = false;
  //     // this.logger.logError("An error occurred while getting data. ${err}");
  //   }});
  // }

  public getItems(){
    this.controllerService.getItems().pipe(takeUntil(this.destroy$)).subscribe({next: (respone: any) => {
      if(respone){
        this.data = respone;
        console.log('items = '+JSON.stringify(this.data));
      }
      this.loader = false;
    }, error: (err: any) => {
      this.loader = false;
      // this.logger.logError("An error occurred while getting data. ${err}");
    }});
  }

  

}
