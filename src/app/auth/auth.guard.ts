import { Injectable } from '@angular/core'
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router'
import { Observable } from 'rxjs'
import { map, take } from 'rxjs/operators'
import { Store } from '@ngrx/store'

import * as fromApp from '../store/app.reducer'

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private store: Store<fromApp.AppState>
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        router: RouterStateSnapshot
    ): boolean | UrlTree | Promise<boolean> | Observable<boolean | UrlTree> {
        return this.store.select('auth').pipe(
            take(1), // don't keep it subscribed, use it ON-DEMAND. Otherwise this guard can cause weird behaviours
            // extract "user" from authState via map operator:
            map((authState) => {
                return authState.user
            }),
            map((user) => {
                const isAuth = !!user

                if (isAuth) {
                    return true
                }

                // manually redirecting here can cause race conditions, usually in older Angular versions
                // here we use the URLTree as a convenient way instead of the manual
                return this.router.createUrlTree(['/auth'])
            })
        )
    }
}
