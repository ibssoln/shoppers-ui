import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill'
import { Subject } from 'rxjs';

export const QuillConfiguration = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    ['link'],
    ['clean'],
  ],
}

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.css']
})
export class WriteComponent {

  public quillConfiguration = QuillConfiguration;

  public postForm: FormGroup = this.formBuilder.group({});
  public varForm: FormGroup = this.formBuilder.group({});
  public control: FormControl = new FormControl();
  public editorInstance: any;

  public loader: boolean = false;
 
  // prevent memory leak
  private destroy$: Subject<void> = new Subject<void>();
  
  constructor(
    private formBuilder: FormBuilder,
    // private itemService: ItemService,
	  // private router: Router,
    // private sessionDataService: SessionDataService,
	// private loggerService: LoggerService,
	// private datePipe: DatePipe,
	// private changeDetectorRef: ChangeDetectorRef
  ){
    // this.faqForm = this.formBuilder.group({
    //   keyword: new FormControl('')
    // });
  }

  ngOnInit() {
    this.control = this.control ?? new FormControl();
    this.postForm.addControl('varData', new FormControl(null, null));
    this.varForm.addControl('varData', new FormControl(null, null));
    this.varForm.controls['varData'].setValue('');
  }

  blured = false
  focused = false
  
  focus($event: any) {
    // tslint:disable-next-line:no-console
    console.log('focus', $event)
    this.focused = true
    this.blured = false
  }

  blur($event: any) {
    // tslint:disable-next-line:no-console
    console.log('blur', $event)
    this.focused = false
    this.blured = true
  }

  public postComment(){
    console.log('post');
  }

  public created(editorInstance: any){
    // tslint:disable-next-line:no-console
    console.log('editor-created', event)
    this.editorInstance = editorInstance;
    this.varForm.controls['varData'].setValue('');
  }

  changedEditor(event: EditorChangeContent | EditorChangeSelection) {
    // tslint:disable-next-line:no-console
    console.log('editor-change', event)
  }

  public enterVariable(event: any){
    console.log('enterVariable = '+event);
    const selectedIndex = this.editorInstance.getSelection(true).index;
    console.log('selectedIndex = '+selectedIndex);
    const selected = this.varForm.controls['varData'].value+' ';
    this.editorInstance.insertText(selectedIndex, selected);
    this.editorInstance.setSelection(selectedIndex + selected.length);
    this.varForm.controls['varData'].setValue('');
  }

  ngOnDestroy(): void{
    this.destroy$.next();
    this.destroy$.complete();
   }

}
