import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies';
import 'rxjs/add/operator/do';
@Injectable()
export class HeadInterceptor implements HttpInterceptor {
    constructor(private router: Router,
        private route: ActivatedRoute, ) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Clone the request to add the new header.
        let authReq = req;
        let token: any;
        try {

            token = JSON.parse(sessionStorage.getItem("session"));

            if (token.token) {
                authReq = req.clone({ headers: req.headers.set('authorization', 'pa ' + token.token) });
                /*   authReq = req.clone({ headers: req.headers.set('authorization', 'pa 24cfdb65d2fb515646ca83c58dd4dadfe') }); */
            }
        } catch (error) {
            // this.router.navigate(['/login']);
            // console.error('获取不到cookie而报错,请从新登录');
        }
        // authReq = req.clone({ headers: req.headers.set('authorization', 'pa 230ae285ca7f88f2194dabaa7cba113ac') });
        return next.handle(authReq).do(event => {
            if (event instanceof HttpResponse) {
                //|| event.body.data.code == "24006"
                if (event.status != 200) {
                    token.token = "";
                    // Cookie.set("cookie", JSON.stringify(token));
                    sessionStorage.setItem("session", "");
                    this.router.navigate(['/login']);
                }
                // console.log(`Request for ${req.urlWithParams} took ${elapsed} ms.`);
            }
        });
    }
}