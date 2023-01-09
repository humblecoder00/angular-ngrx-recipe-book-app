import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'

import * as fromApp from '../store/app.reducer'
import * as AuthActions from './store/auth.actions'

@Injectable({ providedIn: 'root' })
export class AuthService {
    // keeps the reference for token timer to clean the timer when it is time
    private tokenExpirationTimer: any

    constructor(private store: Store<fromApp.AppState>) {}

    setLogoutTimer(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.store.dispatch(new AuthActions.Logout())
        }, expirationDuration)
    }

    clearLogoutTimer() {
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer)
            this.tokenExpirationTimer = null
        }
    }
}
