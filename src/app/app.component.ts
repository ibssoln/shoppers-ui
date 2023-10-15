import { Component } from '@angular/core';
import { ControllerService } from './service/controller/controller.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

 public title = 'shoppers-ui';
 public data: string[] = [];

 constructor(
  private service: ControllerService
 ){}

  public getData(){
    this.service.getData().subscribe((data: any) => {
      this.data = data;
    });
  }

}
