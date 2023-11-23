import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { VarWriteComponent } from './var-write.component';
import Delta, { Op } from 'quill-delta';
import { QuillModule } from 'ngx-quill';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('VarWriteComponent', () => {
  let component: VarWriteComponent;
  let fixture: ComponentFixture<VarWriteComponent>;
  let debugElement: DebugElement;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [
            RouterTestingModule,
            QuillModule,
            ReactiveFormsModule
        ],
        declarations: [ VarWriteComponent ],
        providers: [
            { provide: FormBuilder, useValue: formBuilder },
            QuillModule.forRoot().providers
        ],
        schemas: [
            CUSTOM_ELEMENTS_SCHEMA, 
            NO_ERRORS_SCHEMA
        ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(VarWriteComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();

    // setup
    const form = formBuilder.group({});
    const control = new FormControl(null, null);
    form.addControl('varFormControl', control);
    component.varForm = form;
    component.control = control;
    component.controlName = 'controlName';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should destroy', ()=>{
    const nextSpy = spyOn(component['destroy$'], 'next');
    const completeSpy = spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should run editorChanged', ()=>{
    const emitSpy = spyOn(component.emitValue, 'emit');
    const mockEditor = {selection: {root: {innerHTML: '<p>Mock Value</p>'}},
      setSelection: (index: number)=>{}, 
      getSelection: (bool: boolean)=>{return {index: 0}},
      insertText: (index: number, add: any)=>{}
      };
    component.editorChanged({editor: mockEditor});
    expect(emitSpy).toHaveBeenCalledWith('<p>Mock Value</p>');
  });

//   it('should have qualified options ', ()=>{
//     fixture.detectChanges();
//     const varData: any = fixture.debugElement.query(By.css('#varData'));
//     expect(varData).not.toBeNull();
//     const options: DebugElement[] = varData.queryAll(By.css('option'));
//     // expect(options.length).toEqual(2);
//   });

it('should process editorCreated', ()=>{
    const addBindingsOnKeyInsertSpy = spyOn(component, 'addBindingsOnKeyInsert');
    const addBindingsOnKeyDeleteSpy = spyOn(component, 'addBindingsOnKeyDelete');
    const editor = {selection: {root: {innerHTML: ''}}};
    component.editorCreated(editor);
    expect(component.editor).toEqual(editor);
    // expect(component.varForm.controls['varData'].value).toEqual('');
    expect(addBindingsOnKeyInsertSpy).toHaveBeenCalled();
    expect(addBindingsOnKeyDeleteSpy).toHaveBeenCalled();
  });

  it('should process addBindingsOnKeyInsert', ()=>{
    const editor = {keyboard: {addBinding: (keys: {key: any}, format: {format: any}, fx: (range: any, context: any)=>{})=> {fx}}};
    component.editor = editor;
    component.addBindingsOnKeyInsert();
  });

  it('should process addBindingsOnKeyDelete', fakeAsync(()=>{
    class Keyboard{
         public addBinding(keys: {key: any}, formats: {format: any}, fx: Function){
          fx(null, null);
      }
    }
    let spy = spyOn(component, 'handleDeletionOnCode').and.callFake(()=>{});
    const editor = {keyboard: new Keyboard()};
    component.editor = editor;
    fixture.detectChanges();
    component.addBindingsOnKeyDelete();
  }));

  it('should process emptyOut', fakeAsync(()=>{
    component.editor = new MockEditor('Existing');
    fixture.detectChanges();
    component.emptyOut();
  }));

  it('should process includeReservedKeyword', fakeAsync(()=>{
    expect(component.isReservedKeyword('CUSTOMER_SERVICE')).toBeTrue();
    expect(component.isReservedKeyword('CUSTOMER_ SERVICE')).toBeTrue();
  }));

  it('should process includeReservedKeyword', fakeAsync(()=>{
    expect(component.includeReservedKeyword('CUSTOMER_SERVICE'));
    expect(component.includeReservedKeyword('CUSTOMER_SERVICE PURCHASE_SHOP'));
  }));

  it('should process handleDeletionOnCode', fakeAsync(()=>{
    component.editor = {getSelection: (flag: boolean)=>{return {index: 2}}, 
      deleteText: ()=>{}, setSelection: ()=>{}
      };
    let htmlSpy = spyOn(component, 'getHtml').and.returnValue('<p>Mock</p>');
    let indexInfoSpy = spyOn(component, 'getIndexInfo').and.returnValue({pos: {prev: 0, post: 4}});
    // let deleteTextSpy = spyOn(component.editor, 'deleteText');
    let setSelectionSpy = spyOn(component.editor, 'setSelection');
    component.handleDeletionOnCode({}, {prefix: 'VAR_', suffix: 'VALUE1'});
    fixture.detectChanges();
    // expect(deleteTextSpy).toHaveBeenCalledWith(0, 4);
    // expect(setSelectionSpy).toHaveBeenCalledWith(0);
  }));

  it('should process onKeydown on Tab key', fakeAsync(()=>{
    component.editor = {getSelection: (flag: boolean)=>{return {index: 2}}, 
      deleteText: ()=>{}, setSelection: ()=>{}, updateContents: ()=>{}
      };
    let htmlSpy = spyOn(component, 'getHtml').and.returnValue('<p>Mock<>/p');
    let indexInfoSpy = spyOn(component, 'getIndexInfo').and.returnValue({elemSeq:0, isCodeBlock:false, pos:{prev:0, post: 4}, elems: [{insert: 'Mock', attributes: {'p': true}}]});
    let assessTabEnterUpdateRequiredSpy = spyOn(component, 'assessTabEnterUpdateRequired').and.returnValue({req: true});
    let processTabEnterUpdateTextSpy = spyOn(component, 'processTabEnterUpdateText').and.returnValue(new Delta());
    let emptyOutSpy = spyOn(component, 'emptyOut');
    let updateContentsSpy = spyOn(component.editor, 'updateContents');
    let setSelectionSpy = spyOn(component.editor, 'setSelection');
    component.onKeydown({key: 'Tab'});
    expect(htmlSpy).toHaveBeenCalled();
    expect(indexInfoSpy).toHaveBeenCalled();
    expect(assessTabEnterUpdateRequiredSpy).toHaveBeenCalled();
    expect(processTabEnterUpdateTextSpy).toHaveBeenCalled();
    expect(emptyOutSpy).toHaveBeenCalled();
    expect(updateContentsSpy).toHaveBeenCalled();
    expect(setSelectionSpy).toHaveBeenCalled();
  }));

  it('should process onkeydown on Enter key', fakeAsync(()=> {
    component.editor = {getSelection: (falg: boolean)=>{return {index: 2}}, 
      deleteText:()=>{}, setSelection:()=>{}, updateContents:()=>{}
      };
    let htmlSpy = spyOn(component, 'getHtml').and.returnValue('<p>Mock</p>');
    let indexInfoSpy = spyOn(component, 'getIndexInfo').and.returnValue(
      {elemSeq:0, isCodeBlock: false, pos:{prev: 0, post: 4}, elems: [{insert: 'Mock', attributes: {'p': true}}]}
      );
    let assessTabEnterUpdateRequiredSpy = spyOn(component, 'assessTabEnterUpdateRequired').and.returnValue({req: true});
    let processTabEnterUpdateTextSpy = spyOn(component, 'processTabEnterUpdateText').and.returnValue(new Delta());
    let emptyOutSpy = spyOn(component, 'emptyOut');
    let updateContentsSpy = spyOn(component.editor, 'updateContents');
    let setSelectionSpy = spyOn(component.editor, 'setSelection');
    component.onKeydown({key: 'Enter'});
    expect(htmlSpy).toHaveBeenCalled();
    expect(indexInfoSpy).toHaveBeenCalled();
    expect(assessTabEnterUpdateRequiredSpy).toHaveBeenCalled();
    expect(processTabEnterUpdateTextSpy).toHaveBeenCalled();
    expect(emptyOutSpy).toHaveBeenCalled();
    expect(updateContentsSpy).toHaveBeenCalled();
    expect(setSelectionSpy).toHaveBeenCalled();
  }));

  it('should process processTabEnterUpdateText - case 1', fakeAsync(()=>{
    let elems = [{insert: 'VAR_', attributes: {'code': true}}, {insert: '\n'}, {insert: 'VALUE', attributes: {'code': true}}];
    let expected = new Delta().insert('VAR_VALUE', {'code': true});
    expect(component.processTabEnterUpdateText(elems, {index: 1})).toEqual(expected);
  }));

  it('should process processTabEnterUpdateText - case 2', fakeAsync(()=>{
    let elems = [{insert: 'VAR_', attributes: {'code': true}}, {insert: '\t'}, {insert: 'VALUE', attributes: {'code': true}}, 
      {insert: 'ANOTHER_VALUE', attributes: {'p': true}}];
    let expected = new Delta().insert('VAR_VALUE', {'code': true}).insert('ANOTHER_VALUE', {'p': true});
    expect(component.processTabEnterUpdateText(elems, {index: 1})).toEqual(expected);
  }));

  it('should process assessTabEnterUpdateRequired - case 1', fakeAsync(()=>{
    let includeReservedKeywordSpy = spyOn(component, 'includeReservedKeyword').and.returnValue(true);
    let elems = [{insert: 'OTHER', attributes: {'p': true}}, {insert: 'CUSTOMER_', attributes: {'code': true}}, 
                {insert: '\n'}, {insert: 'SERVICE', attributes: {'code': true}}];
    expect(component.assessTabEnterUpdateRequired(elems, 1, '\n', elems)).toEqual({req: true, index: 2});
    expect(includeReservedKeywordSpy).toHaveBeenCalled();
  }));

  it('should process assessTabEnterUpdateRequired - case 2', fakeAsync(()=>{
    let includeReservedKeywordSpy = spyOn(component, 'includeReservedKeyword').and.returnValue(true);
    let elems = [{insert: 'OTHER', attributes: {'p': true}}, {insert: 'CUSTOMER_', attributes: {'code': true}}, 
                {insert: '\n'}, {insert: 'SERVICE', attributes: {'code': true}}];
    expect(component.assessTabEnterUpdateRequired(elems, 2, '\n', elems)).toEqual({req: true, index: 2});
    expect(includeReservedKeywordSpy).toHaveBeenCalled();
  }));

  it('should process assessTabEnterUpdateRequired - case 3', fakeAsync(()=>{
    let includeReservedKeywordSpy = spyOn(component, 'includeReservedKeyword').and.returnValue(true);
    let elems = [{insert: 'OTHER', attributes: {'p': true}}, {insert: 'CUSTOMER_', attributes: {'code': true}}, 
                {insert: '\n'}, {insert: 'SERVICE', attributes: {'code': true}}];
    expect(component.assessTabEnterUpdateRequired(elems, 3, '\n', elems)).toEqual({req: true, index: 2});
    expect(includeReservedKeywordSpy).toHaveBeenCalled();
  }));

  it('should process insertValue', fakeAsync(()=>{
    component.editor = {clipboard: {convert: (val: any)=> {return new Delta().insert(`<p>testMock</p>`)}}, 
    getSelection: (flag: boolean)=>{return {index: 2}}, deleteText: ()=>{}, setSelection: ()=>{}, updateContents: ()=>{}};
    let setSelectionSpy = spyOn(component.editor, 'setSelection');
    expect(component.insertValue(0, 'testMock', '<p>testMock</p>')).toEqual(8);
    expect(setSelectionSpy).toHaveBeenCalledWith(8);
  }));

//   it('should process enterVariable - case 1', fakeAsync(()=>{
//     component.editor = {clipboard: {convert: (val: any)=>{return new Delta().insert(`<p>testMock</p>`)}}, 
//                         getSelection: (flag: boolean)=>{return {index: 2}}, deleteText: ()=>{}, setSelection: ()=>{}, updateContents: ()=>{}};
//    let getHtmlSpy = spyOn(component, 'getHtml').and.returnValue(new Delta());
//    let indexInfoSpy = spyOn(component, 'getIndexInfo').and.returnValue(
//     {elemSeq: 0, isCodeBlock: true, pos: {prev: 0, post: 13}, elems: [{insert: 'CUSTOMER_SERVICE', attributes: {'code': true}}, {insert: ' '}]});
//     let insertValueSpy = spyOn(component, 'insertValue');
//     let assignAndEmitNewValueSpy = spyOn<any>(component, 'assignAndEmitNewValue');
//     // component.varForm.controls['varData'].setValue('');
//     component.varForm.controls['varData'].setValue('CUSTOMER_SERVICE');
//     component.enterVariable('varData');
//   }));

// it('should process getIndexInfo', fakeAsync(()=>{
//     let html = [{insert: 'OTHER', attributes: {'p': true}}, {insert: 'CUSTOMER_SERVICE', attributes: {'code': true}}, {insert: ' '}, 
//                 {insert: 'ANOTHER', attributes: {'p': true}}];
//     let expected = {elemSeq: 3, isCodeBlock: false, pos: {prev: 1, post: 25}, elems: html};
//     expect(component.getIndexInfo(20, html)).toEqual(expected);
// }));

    it('should process getHtml', fakeAsync(()=>{
        component.editor = new MockEditor('<p>MockData</p>');
        const expected = new Delta().insert('<p>MockData</p>');
        expect(component.getHtml()).toEqual(expected);
    }));

    it('should process assignAndEmitNewValue', fakeAsync(()=>{
        component.editor = {selection: {root: {innerHTML: '<p>Value1</p>'}}, 
                            setSelection: (index: number)=>{}, getSelection: (bool: boolean)=>{return {index: 0}}, 
                            insertText: (index: number, add: any)=>{}};
        let emitSpy = spyOn(component.emitValue, 'emit');
        let setSelectionSpy = spyOn(component.editor, 'setSelection');
        component['assignAndEmitNewValue'](5);
        expect(component.control.value).toEqual('<p>Value1</p>');
        expect(emitSpy).toHaveBeenCalled();
        expect(setSelectionSpy).toHaveBeenCalled();
    }));

});

export class MockEditor{
    public html = '';
    public selection = {root: {innerHTML: {text: this.html, length: this.html.length}}};
    public clipboard = {convert: (val: any)=>{return new Delta().insert(this.html)}};
    public updateContents(delta: any, user: any){this.html=delta};
    public setSelection: (() => {}) | undefined;
    constructor(html: any){this.html = html;};
  }