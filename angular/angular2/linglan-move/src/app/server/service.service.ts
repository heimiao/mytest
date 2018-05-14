import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Login } from '../entity/entity';

import { Config } from '../config';

@Injectable()
export class ServiceService {

  constructor(private http: HttpClient) { } 

}
