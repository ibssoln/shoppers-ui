import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill'
import { Subject } from 'rxjs';
import Delta, { Op } from 'quill-delta';

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
  selector: 'app-var-write',
  templateUrl: './var-write.component.html',
  styleUrls: ['./var-write.component.css']
})
export class VarWriteComponent {

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
    // console.log('focus', $event)
    this.focused = true
    this.blured = false
  }

  blur($event: any) {
    // tslint:disable-next-line:no-console
    // console.log('blur', $event)
    this.focused = false
    this.blured = true
  }

  public postComment(){
    // console.log('post');
  }

  public created(editorInstance: any){
    // tslint:disable-next-line:no-console
    // console.log('editor-created', event)
    this.editorInstance = editorInstance;
    this.varForm.controls['varData'].setValue('');

    //------------ additional -------
    this.editorInstance.keyboard.addBinding({ key: 'Delete' }, 
    {
      format: ['code']
    },
    (range: any, context: any) => {
      console.log('# Delete = range='+JSON.stringify(range)+', conext='+JSON.stringify(context));
    });

    //------------ additional -------
    this.editorInstance.keyboard.addBinding({ key: 'K', shiftKey: null, altKey: null, metaKey:null, ctrlKey:null, shortKey: null }, 
    {
      format: ['code']
    },
    (range: any, context: any) => {
      console.log('# K = range='+JSON.stringify(range)+', conext='+JSON.stringify(context));
    });

    //------------ final solution -------
    this.editorInstance.keyboard.addBinding({ key: 'Backspace' }, 
    {
      format: ['code', 'list']
    },
    (range: any, context: any) => {
      console.error('Backspace pressed');
      if(context.format.list){
        console.error('list');
        this.editorInstance.format('list', false);
      }else{
        console.error('code');
        //------------ determine which element was clicked & delte it --------
        const index = this.editorInstance.getSelection(true).index;
        const clip = this.editorInstance.clipboard.convert(
          this.editorInstance.selection.root.innerHTML
        );    
        console.log('html = '+JSON.stringify(clip));
        let count = 0;
        let before, after, iter = 0;
        let found: any;
        let newText = new Delta();
        clip.map((op: any) => {
          iter++;
          before = count;
          count += op.insert.length;
          after = count;
          if((index > before) && (index <= after)){
            found = op.insert+iter;
            // newText.insert(op.insert, op.attributes);
          }else{
            newText.insert(op.insert, op.attributes);
          }
        })
        .join('');
        console.log('total count = '+count);
        console.log('before = '+before);
        console.log('====> index = '+index+'<======');
        console.log('after = '+after);
        console.log('>> found = '+found);
        console.log('total iter = '+iter);
        //------------ determine which element was clicked --------
        //------------------ change the results ===============
        // let count2 = 0;
        // let final, skip: any;
        // let newText = new Delta();
        // const text = clip
        // // .filter((op: any) => typeof op.insert == 'string')
        // .map((op: any) => {
        //   count2++;
        //   if(op.insert+count2 != found){
        //     final = op.insert+count2;
        //     newText.insert(op.insert, op.attributes);
        //   }else{
        //     skip = op.insert+count2;
        //     // newText.delete(op.insert);
        //   }
        // })
        // .join('');
        // console.log('#final  = '+final);
        // console.log('#skip  = '+skip);
        console.log('newText = '+JSON.stringify(newText));
        //parse
        // const clipboardDelta = this.editorInstance.clipboard.convert(
        //   newText
        // );

        //---------------- empty out
        this.emptyOut();
        //---------------- empty out
       
        const delta = new Delta().concat(newText);
        this.editorInstance.updateContents(delta, 'user');
        //------------------ change the results ===============
      }
    });
  }

  changedEditor(event: EditorChangeContent | EditorChangeSelection) {
    // tslint:disable-next-line:no-console
    // console.log('editor-change', event)
  }

  // type1
  //public enterVariable(event: any){
    // console.log('enterVariable = '+event);
    // const selectedIndex = this.editorInstance.getSelection(true).index;
    // console.log('selectedIndex = '+selectedIndex);
    // const selected = this.varForm.controls['varData'].value+' ';
    // this.editorInstance.insertText(selectedIndex, selected);
    // this.editorInstance.setSelection(selectedIndex + selected.length);
    // this.varForm.controls['varData'].setValue('');
  //}

  // type2
  public enterVariable(event: any): void{
    console.log('testEnter1');
    const cursorPosition = this.editorInstance.getSelection(true).index;
    const selected = this.varForm.controls['varData'].value;
    const clipboardDelta = this.editorInstance.clipboard.convert(
      `<code>${selected}</code>`
    );
    const delta = new Delta().retain(cursorPosition).concat(clipboardDelta);
    this.editorInstance.updateContents(delta, 'user');
    this.editorInstance.setSelection(Number(cursorPosition + selected.length));

    const cursorPosition2 = this.editorInstance.getSelection(true).index;
    const space = this.editorInstance.clipboard.convert(
      `<p>&nbsp;</p>`
    );
    const delta2 = new Delta().retain(cursorPosition2).concat(space);
    this.editorInstance.updateContents(delta2, 'user');

    const controlNewValue = this.editorInstance.selection.root.innerHTML;
    console.log('emit = '+controlNewValue);
    this.editorInstance.setSelection(Number(cursorPosition2 + 1));
  }

  //type3
  public onKeyDown(event: any){
    const index = this.editorInstance.getSelection(true).index;

    const clip = this.editorInstance.clipboard.convert(
      this.editorInstance.selection.root.innerHTML
    );    
    console.log('html = '+JSON.stringify(clip));

    //------------ determine which element was clicked --------
    // let count = 0;
    // let before, after, iter = 0;
    // let found: any;
    // clip
    // .map((op: any) => {
    //   iter++;
    //   before = count;
    //   count += op.insert.length;
    //   after = count;
    //   if((count > before) && (count <= after)){
    //     found = op.insert+iter
    //   }
    // })
    // .join('');
    // console.log('total count = '+count);
    // console.log('before = '+before);
    // console.log('count = '+count);
    // console.log('after = '+after);
    // console.log('found = '+found);
    //------------ determine which element was clicked --------

    //------------------ change the results ===============
    // let newText = new Delta();
    // const text = clip
    // .filter((op: any) => typeof op.insert == 'string')
    // .map((op: any) => {
    //   if(op.insert=='[CUSTOMER_SERVICE]'){
    //     newText.insert(op.insert, op.attributes);
    //   }else{
    //     // newText.delete(op.insert);
    //   }
    // })
    // .join('');
    // console.log('text = '+JSON.stringify(newText));
    // //parse
    // // const clipboardDelta = this.editorInstance.clipboard.convert(
    // //   newText
    // // );
    // const delta = new Delta().concat(newText);
    // this.editorInstance.updateContents(delta, 'user');
    //------------------ change the results ===============

    // console.log('onKeyDown');
    // if(event.key=='Backspace'){
    //   // console.log('Backspace');

    // }else if(event.key=='Delete'){
    //   // console.log('Delete');
    
    // }
  }

  //type4
  public emptyOut(){

    // if(event.key=='Delete'){
      console.log('Delete');
      const existing = this.editorInstance.selection.root.innerHTML;
      const clipboardDelta = this.editorInstance.clipboard.convert(
        `<p><p>`
      );
      const delta = new Delta().delete(existing.length).concat(clipboardDelta);
      this.editorInstance.updateContents(delta, 'user');
      const afterChanged = this.editorInstance.selection.root.innerHTML;
      console.log('after changed = '+JSON.stringify(afterChanged));
    // }
  }

  ngOnDestroy(): void{
    this.destroy$.next();
    this.destroy$.complete();
   }

}
