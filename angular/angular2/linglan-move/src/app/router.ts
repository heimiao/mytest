import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';

import { ErrorPageComponent } from './error-page/error-page.component';
import { DoctorlistComponent } from './doctorlist/doctorlist.component';
import { DoctorinfoComponent } from './doctorinfo/doctorinfo.component';
import { ServicetypeComponent } from './servicetype/servicetype.component';
import { MyorderComponent } from './myorder/myorder.component';
import { OrderinfoComponent } from './orderinfo/orderinfo.component';
import { MydoctorComponent } from './mydoctor/mydoctor.component';


export const appRoutes: Routes = [  
  {
    path: 'mydoctor', component: MydoctorComponent
    // data: { title: 'Heroes List' }
  },
  {
    path: 'doctorinfo', component: DoctorinfoComponent
    // data: { title: 'Heroes List' }
  },
  {
    path: 'servicetype/:id', component: ServicetypeComponent
    // data: { title: 'Heroes List' }
  },
  {
    path: 'doctorlist', component: DoctorlistComponent
    // data: { title: 'Heroes List' }
  },
  {
    path: 'myorder', component: MyorderComponent
    // data: { title: 'Heroes List' }
  },
  {
    path: 'orderinfo/:id', component: OrderinfoComponent
    // data: { title: 'Heroes List' }
  },

  {
    path: 'login', component: LoginComponent
    // data: { title: 'Heroes List' }
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  //以上都匹配不到的情况下会会转发到错误页面
  { path: '**', component: ErrorPageComponent }
];
