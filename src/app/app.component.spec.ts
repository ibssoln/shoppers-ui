import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { FormBuilder } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

describe('AppComponent', () => {
    // let component: AppComponent;
    // let fixture: ComponentFixture<AppComponent>;
    // let debugElement: DebugElement;
    // const formBuilder: FormBuilder = new FormBuilder();
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let debugElement: DebugElement;
    // let statusService: StatusService;
    let mockRouter = {
        navigate: jasmine.createSpy('navigate'),
        url: ''
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        imports: [
            RouterTestingModule,
            // NgIdleKeepaliveModule
        ],
        declarations: [
            AppComponent
        ],
        providers: [
            // {provide: FormBuilder, useValue: formBuilder},
            // QuillModule.forRoot().providers,
            // LoggerService,
            // AppStateService,
            // UserinfoService,
            // Idle,
            { provide: HttpClient, useValue: jasmine.createSpyObj('httpClient', ['get'])},
            // { provide: UserinfoService, useValue: userinfoServiceSpy },
            // { provide: Router, useValue: mockRouter },
        ], 
        schemas: [
            CUSTOM_ELEMENTS_SCHEMA
        ]
        }).compileComponents();
        fixture = TestBed.createComponent(AppComponent);
        debugElement = fixture.debugElement;
        component = fixture.componentInstance;
        // appStateService = debugElement.injector.get(AppSateService);
        fixture.detectChanges();
    });

  it('should create', ()=>{
	expect(component).toBeTruthy();
  });

//   it('should create authentication', ()=>{
//     const authUserId = '123456789';
    // let aUser = new User();
    // aUser.setIdName(id, name, lastname);
    // localStorage.setItem('claim_name', authFullname);
    // component.loadSSOAuthenticationData();
    // tick(1000);
    // fixture.detectChanges();
    // expect(component.authFullName).toEqual(authFullName);
    // discardPeriodicTasks();
//   });



});
