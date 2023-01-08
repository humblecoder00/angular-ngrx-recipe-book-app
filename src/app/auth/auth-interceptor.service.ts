import { Injectable } from "@angular/core";
import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { take, exhaustMap } from 'rxjs/operators'

import { AuthService } from "./auth.service";

@Injectable({ providedIn: 'root' })
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.authService.user.pipe(
            // if you don't want to keep it subscribe, you can use the "take" operator from RxJS
            // "take" tells RxJS to take one value from that Observable, and thereafter it should automatically unsubscribe.
            // so the line below manages the subscription, gives us the latest user, then unsubscribes.
            // because here we just want to get the user on demand (whenever we click on fetch), not an ongoing subscription.
            take(1),
            // exhaustMap waits for the first Observable to complete
            // so we get that user afterwards.
            exhaustMap(user => {
                // don't try to set header if there is no user - no user means no token
                if (!user) {
                    return next.handle(req)
                }
                // otherwise clone the request and set the header
                const modifiedReq = req.clone({
                    params: new HttpParams().set('auth', user.token)
                })
                return next.handle(modifiedReq)
            }))
    }
}