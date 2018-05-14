import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Import HttpClientModule from @angular/common/http
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeadInterceptor } from './intercpet'

// 导入路由模块
import { RouterModule, Routes } from '@angular/router';
import { appRoutes } from './router';

import { Util } from './util';

// import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { AccordionModule, AlertModule, ButtonsModule, ModalModule } from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { DoctorlistComponent } from './doctorlist/doctorlist.component';
import { DoctorinfoComponent } from './doctorinfo/doctorinfo.component';
import { ServicetypeComponent } from './servicetype/servicetype.component';
import { MyorderComponent } from './myorder/myorder.component';
import { OrderinfoComponent } from './orderinfo/orderinfo.component';
import { ScrollDirective } from './directive/scroll.directive';
import { FilterPipe, parseIntPipe, myDatePipe } from './pipe/filter.pipe';
import { MydoctorComponent } from './mydoctor/mydoctor.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorPageComponent,
    DoctorlistComponent,
    DoctorinfoComponent,
    ServicetypeComponent,
    MyorderComponent,
    OrderinfoComponent,
    ScrollDirective,
    FilterPipe,
    parseIntPipe,
    myDatePipe,
    MydoctorComponent
  ],
  
  imports: [
    // NgbModule.forRoot(),
    AccordionModule.forRoot(),
    AlertModule.forRoot(),
    ButtonsModule.forRoot(),
    ModalModule.forRoot(),
    //
    BrowserModule,
    // 请求
    HttpClientModule,
    // 模版表单
    FormsModule,
    // 动态表单
    ReactiveFormsModule,
    // 请求
    HttpModule,
    // 路由
    RouterModule.forRoot(appRoutes), // ,{useHash: true}{ enableTracing: true }
  ],

  providers: [Util, {
    provide: HTTP_INTERCEPTORS,
    useClass: HeadInterceptor,
    multi: true,
  }],

  bootstrap: [AppComponent]
})
export class AppModule { }
