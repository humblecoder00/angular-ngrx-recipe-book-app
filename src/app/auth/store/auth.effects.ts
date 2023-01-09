import { HttpClient } from '@angular/common/http'
import { Actions, ofType } from '@ngrx/effects'
import { of } from 'rxjs'
import { catchError, map, switchMap, tap } from 'rxjs/operators'

import * as AuthActions from './auth.actions'

import { environment } from '../../../environments/environment'
import { Effect } from '@ngrx/effects'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { User } from '../user.model'
import { AuthService } from '../auth.service'
const { API_KEY } = environment

const moduleUrls = {
    signup: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    signin: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
}

// it is best practice to define the interface of data you're working with
// so you can hint to the http methods what are you going to get.
export interface AuthResponseData {
    idToken: string // A Firebase Auth ID token for the newly created user.
    email: string // The email for the newly created user.
    refreshToken: string // A Firebase Auth refresh token for the newly created user.
    expiresIn: string // The number of seconds in which the ID token expires.
    localId: string // The uid of the newly created user.
    registered?: boolean // Whether the email is for an existing account. (ONLY FOR LOGIN, REST ABOVE IS USED IN BOTH LOGIN & REGISTER)
}

const handleAuthentication = (
    expiresIn: number,
    email: string,
    userId: string,
    token: string
) => {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
    const user = new User(email, userId, token, expirationDate)
    // set it to localStorage:
    localStorage.setItem('userData', JSON.stringify(user))

    return new AuthActions.AuthenticateSuccess({
        email,
        userId,
        token,
        expirationDate,
    })
}

const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occured!'
    if (!errorRes.error || !errorRes.error.error) {
        return of(new AuthActions.AuthenticateFail(errorMessage))
    }

    switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMessage = 'This email exists already'
            break
        // alternatively, you can ignore to giving hint about if email or password was problematic
        // to enhance the security, but just in this example we're specific
        case 'EMAIL_NOT_FOUND':
            errorMessage = 'This email does not exist'
            break
        case 'INVALID_PASSWORD':
            errorMessage = 'This password is not correct'
            break
    }

    // return a non-error observable
    return of(new AuthActions.AuthenticateFail(errorMessage))
}

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService
    ) {}

    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.SignupStart) => {
            return this.http
                .post<AuthResponseData>(moduleUrls.signup, {
                    email: signupAction.payload.email,
                    password: signupAction.payload.password,
                    returnSecureToken: true, // firebase related - Whether or not to return an ID and refresh token. Should always be true.
                })
                .pipe(
                    tap((resData) => {
                        this.authService.setLogoutTimer(
                            +resData.expiresIn * 1000
                        ) // pass the milliseconds
                    }),
                    map((resData) =>
                        handleAuthentication(
                            +resData.expiresIn,
                            resData.email,
                            resData.localId,
                            resData.idToken
                        )
                    ),
                    catchError((errorRes) => handleError(errorRes))
                )
        })
    )

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http
                .post<AuthResponseData>(moduleUrls.signin, {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true, // firebase related - Whether or not to return an ID and refresh token. Should always be true.
                })
                .pipe(
                    tap((resData) => {
                        this.authService.setLogoutTimer(
                            +resData.expiresIn * 1000
                        ) // pass the milliseconds
                    }),
                    map((resData) =>
                        handleAuthentication(
                            +resData.expiresIn,
                            resData.email,
                            resData.localId,
                            resData.idToken
                        )
                    ),
                    catchError((errorRes) => handleError(errorRes))
                )
        })
    )

    // This won't dispatch any action
    @Effect({ dispatch: false })
    authRedirect = this.actions$.pipe(
        // You can also REACT to multiple actions (basically mapping this effect to various actions):
        // ofType(AuthActions.AUTHENTICATE_SUCCESS, AuthActions.LOGOUT),
        // But watchout for the RACE CONDITIONS if something goes wrong (for example due to a Route Guard)
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap(() => {
            this.router.navigate(['/'])
        })
    )

    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            const userData: {
                email: string
                id: string
                _token: string
                _tokenExpirationDate: string
            } = JSON.parse(localStorage.getItem('userData'))
            if (!userData) {
                return {
                    type: 'DUMMY',
                }
            }

            const loadedUser = new User(
                userData.email,
                userData.id,
                userData._token,
                new Date(userData._tokenExpirationDate) // convert date string to date
            )

            // if token is valid, set the authenticated user
            if (loadedUser.token) {
                // handle the token countdown here
                // basically first we need to figure out the current countdown
                // we do it by token expiration date (future) minus current time, which will give the remaining milliseconds
                const expirationDuration =
                    new Date(userData._tokenExpirationDate).getTime() -
                    new Date().getTime()

                this.authService.setLogoutTimer(expirationDuration) // pass the milliseconds

                return new AuthActions.AuthenticateSuccess({
                    email: loadedUser.email,
                    userId: loadedUser.id,
                    token: loadedUser.token,
                    expirationDate: new Date(userData._tokenExpirationDate), // convert date string to date
                })
            }

            // Dummy action without effect
            return {
                type: 'DUMMY',
            }
        })
    )

    @Effect({ dispatch: false })
    authLogout = this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
            this.authService.clearLogoutTimer()
            localStorage.removeItem('userData')
            this.router.navigate(['/auth'])
        })
    )
}
