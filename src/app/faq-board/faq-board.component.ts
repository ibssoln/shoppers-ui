import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-faq-board',
  templateUrl: './faq-board.component.html',
  styleUrls: ['./faq-board.component.css']
})
export class FaqBoardComponent implements OnInit, OnDestroy{

  public faqForm: FormGroup;

  // prevent memory leak
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder
  ){
    this.faqForm = this.formBuilder.group({
      keyword: new FormControl('')
    });
  }

  ngOnInit(): void{
    this.refreshDatagrid();
  }

 private refreshDatagrid(): void{
  
 }  

 ngOnDestroy(): void{
	this.destroy$.next();
	this.destroy$.complete();
 }

}
