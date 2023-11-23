import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Output() emitValue = new EventEmitter<string>();
  
  public quillConfiguration = QuillConfiguration;
  public postForm: FormGroup = this.formBuilder.group({});
  public varForm: FormGroup = this.formBuilder.group({});
  public control: FormControl = new FormControl();
  public controlName: string = 'containerControl';
  public editor: any;
  public loader: boolean = false;
  public KEYWORDS = ['CUSTOMER_SERVICE','PURCHASE_SHOP'];
 
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
    this.postForm.addControl('containerControl', new FormControl(null, null));
    this.varForm.addControl('varData', new FormControl(null, null));
    this.varForm.controls['varData'].setValue('');
  }

  ngAfterViewInit() {
    this.varForm.controls['varData'].setValue('');
  }

  public postComment(){
  }

  public editorChanged(event: any) {
    this.emitValue.emit(event.editor.selection.root.innerHTML);
  }

  public editorCreated(editor: any){
    this.editor = editor;
    // this.varForm.controls['varData'].setValue('');
    this.addBindingsOnKeyInsert();
    this.addBindingsOnKeyDelete();
  }

  public getHtml(){
    const html = this.editor.clipboard.convert(
      this.editor.selection.root.innerHTML
    );
    return html;
  }

  public getIndexInfo(index: any, html: any): any{
    let i=0, prev=0, post=0, pointer=0, isCodeBlock=false, elemSeq=0, elems: Array<any>=[];
    let pos: {prev: any, post: any} = {prev: 0, post: 0};
    html.map((op: any)=> {
      elems.push(op);
      prev = pointer;
      pointer += op.insert.length;
      post = pointer;
      if(((index==0 && prev==0) || (index > prev)) && (index <= post)){
        elemSeq = i;
        isCodeBlock = !!(op.attributes?.code);
        pos = {prev, post};
      }
      i++;
    });
    return {elemSeq, isCodeBlock, pos, elems};
  }

  public enterVariable(fieldName: any): void{
    const varValue = this.varForm.controls[fieldName].value;
    if(varValue){
      const html = this.getHtml();
      const index = this.editor.getSelection(true).index;
      let {elemSeq, isCodeBlock, pos, elems} = this.getIndexInfo(index, html);
      let cursorPosition = index;
      if(isCodeBlock){
        cursorPosition = pos.post+1;
      }
      cursorPosition = this.insertValue(cursorPosition, varValue, `<code>${varValue}</code>`);
      cursorPosition = this.insertValue(cursorPosition, ' ', `<p>&nbsp;</p>`);
      this.assignAndEmitNewValue(cursorPosition);
    }
  }

  private assignAndEmitNewValue(cursorPosition: any): void{
    const html = this.editor.selection.root.innerHTML;
    this.control.setValue(html);
    this.emitValue.emit(html);
    this.editor.setSelection(cursorPosition);
  }

  public insertValue(position: any, textOnly: any, textWithTag: any): any{
    const clip = this.editor.clipboard.convert(textWithTag);
    const delta = new Delta().retain(position).concat(clip);
    this.editor.updateContents(delta, 'user');
    const newCursorPos = Number(position + textOnly.length);
    this.editor.setSelection(newCursorPos);
    return newCursorPos;
  }

  public preventInsert(range: any, context: any){};

  public assessTabEnterUpdateRequired(html: any, elemSeq: any, criteria: any, elems: any): any{
    let updateReq = {req: false, index: 0};
    let i=0;
    html.map((op: any) => {
      if((i>=(elemSeq-1)) && (i<=(elemSeq+1))){
        if(op.insert==criteria){
          if((i>0) && (i<(elems.length-1))
          && !!(elems[i-1].attributes?.code) && !!(elems[i+1].attributes?.code)
          && !!(elems[i-1].insert) && !!(elems[i+1].insert)
          && this.includeReservedKeyword(elems[i-1].insert.concat(elems[i+1].insert))
          ){
            updateReq = {req: true, index: i};
          }
        }
      }
      i++;
    });
    return updateReq;
  }

  public processTabEnterUpdateText(elems: any, updateReq: any): any{
    let k=0;
    let updateText = new Delta();
    elems.map((op: any) => {
      if((k==(updateReq.index-1)) || (k==(updateReq.index+1))){
        //skip
      }else if(k==updateReq.index){
        updateText.insert((elems[k-1].insert.replace(/\s/g, "").toUpperCase().concat(elems[k+1].insert.replace(/\s/g, '').toUpperCase())), elems[k-1].attributes);
      }else{
        updateText.insert(op.insert, op.attributes);
      }
      k++;
    });
    return updateText;
  }

  public onKeydown(event: any){
    if(event.key=='Tab' || event.key=='Enter'){
      let criteria = '';
      if(event.key=='Enter'){
        criteria='\n';
      }
      if(event.key=='Tab'){
        criteria='\t';
      }
      const html = this.getHtml();
      const index = this.editor.getSelection(true).index;
      let {elemSeq, isCodeBlock, pos, elems} = this.getIndexInfo(index, html);
      let updateReq = this.assessTabEnterUpdateRequired(html, elemSeq, criteria, elems);
      if(!!updateReq.req){
        let updateText = this.processTabEnterUpdateText(elems, updateReq);
        this.emptyOut();
        const delta = new Delta().concat(updateText);
        this.editor.updateContents(delta, 'user');
        this.editor.setSelection(index);
      }
    }
  }

  public isReservedKeyword(checkWord: string): boolean{
    return ((this.KEYWORDS.filter((word: string)=>(
      word.localeCompare(checkWord.replace(/\s/g, '').toUpperCase())==0))).length > 0);
  }

  public includeReservedKeyword(checkWord: string): boolean{
    return ((this.KEYWORDS.filter((word: string)=>(
      checkWord.replace(/\s/g, '').toUpperCase().includes(word)))).length > 0);
  }

  public handleDeletionOnCode(range: any, context: any): void{
    if(this.includeReservedKeyword(context.prefix.concat(context.suffix))){
      const html = this.getHtml();
      const index = this.editor.getSelection(true).index;
      let {pos} = this.getIndexInfo(index, html); 
      this.editor.deleteText(pos.prev, Number(pos.post-pos.prev));
      this.editor.setSelection(pos.prev);
    }
  }

  private getAllIndexOf(target: string, match: string, count: number): any{
    let indices = [];
    let checkStart = 0, iter: number = 0;
    while(iter < count){
      let index = target.indexOf(match, checkStart);
      indices.push(index);
      checkStart = index+1;
      iter++;
    }
    return indices;
  }

  public emptyOut(){
    const existing = this.editor.selection.root.innerHTML;
    const clipboardDelta = this.editor.clipboard.convert(
      `<p></p>`
    );
    const delta = new Delta().delete(existing.length).concat(clipboardDelta);
    this.editor.updateContents(delta, 'user');
    const afterChanged = this.editor.selection.root.innerHTML;
  }

  public addBindingsOnKeyDelete(){
    this.editor.keyboard.addBinding({key: 'Backspace'}, {format: ['code']},
    (range: any, context: any)=>{this.handleDeletionOnCode(range, context)});
    this.editor.keyboard.addBinding({key: 'Delete'}, {format: ['code']},
    (range: any, context: any)=>{this.handleDeletionOnCode(range, context)});
  }

  public addBindingsOnKeyInsert(){
    this.editor.keyboard.addBinding({key: 'A', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: 'B', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: 'C', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: 'D', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: 'E', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: 'F', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: 'G', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: 'H', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: 'I', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: 'J', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: 'K', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: 'L', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: 'M', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: 'N', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: 'O', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: 'P', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: 'Q', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: 'R', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: 'S', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: 'T', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: 'U', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: 'V', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: 'W', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: 'X', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: 'Y', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: 'Z', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: '', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
    this.editor.keyboard.addBinding({key: '', metaKey: null, ctrlKey: null, shiftKey: null, altKey: null, shortKey: null}, {format: ['code']}, this.preventInsert);
  
  }

  ngOnDestroy(): void{
    this.destroy$.next();
    this.destroy$.complete();
   }

}
