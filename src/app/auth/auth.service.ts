import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, Subject, throwError } from "rxjs";

import { User } from "./user.model";

import { environment } from '../../environments/environment'
const { API_KEY} = environment

const moduleUrls = {
    signup: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    signin: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`
}

// it is best practice to define the interface of data you're working with
// so you can hint to the http methods what are you going to get.
export interface AuthResponseData {
    idToken: string	// A Firebase Auth ID token for the newly created user.
    email: string	// The email for the newly created user.
    refreshToken: string	// A Firebase Auth refresh token for the newly created user.
    expiresIn: string	// The number of seconds in which the ID token expires.
    localId: string // The uid of the newly created user.
    registered?: boolean // Whether the email is for an existing account. (ONLY FOR LOGIN, REST ABOVE IS USED IN BOTH LOGIN & REGISTER)
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    // idea is to emit / "next" a User when there is a new user via login, or logout / when token gets expired:
    // user = new Subject<User>()

    // both on demand & onchange emittable user data:
    // DIFF between Subject and BehaviourSubject - we can get access to this even after it gets emitted, 
    // while in Subject we get access when it gets emitted. So it is both subscribe-able and static in one way.
    user = new BehaviorSubject<User>(null)

    // keeps the reference for token timer to clean the timer when it is time
    private tokenExpirationTimer: any

    constructor(private http: HttpClient, private router: Router) {}
    
    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>(moduleUrls.signup, {
            email,
            password,
            returnSecureToken: true // firebase related - Whether or not to return an ID and refresh token. Should always be true.
        }).pipe(
            catchError(this.handleError),
            tap(resData => {
                this.handleAuthentication(
                    resData.email,
                    resData.localId,
                    resData.idToken,
                    +resData.expiresIn
                )
            })
        )
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        /*  we need to set the expiry date. Here is how:
            we get expiry time by seconds from firebase, let's say 3600
            with that, we create a new date from now, getTime returns the milliseconds
            then we add the expiresIn * 1000 to add the related amount of milliseconds for expiry from now on. 
            */
            const expirationDate = new Date(
            new Date().getTime() + expiresIn * 1000
        )
        const user = new User(
            email,
            userId, 
            token,
            expirationDate
        )
        // use Subject to next the user (set, emit this currently logged in user)
        this.user.next(user)

        // call the count-down handler for logout (token expiry) rightaway here
        this.autoLogout(expiresIn * 1000) // times 1000, to make it milliseconds to seconds (expiresIn gives us seconds)

        // set it to localStorage:
        localStorage.setItem('userData', JSON.stringify(user))
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(moduleUrls.signin, {
            email,
            password,
            returnSecureToken: true // firebase related - Whether or not to return an ID and refresh token. Should always be true.
        }).pipe(
            catchError(this.handleError),
            tap(resData => {
                this.handleAuthentication(
                    resData.email,
                    resData.localId,
                    resData.idToken,
                    +resData.expiresIn
                )
            })
        )
    }

    // automatically login the user if the token is valid and exists in the localStorage
    autoLogin() {
        const userData: {
            email: string
            id: string
            _token: string
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'))
        if (!userData) {
            return
        }

        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate) // convert date string to date
        )

        // if token is valid, set the authenticated user
        if (loadedUser.token) {
            this.user.next(loadedUser)

            // handle the token countdown here
            // basically first we need to figure out the current countdown
            // we do it by token expiration date (future) minus current time, which will give the remaining milliseconds

            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
            this.autoLogout(expirationDuration)
        }
    }

    logout() {
        // set the user Subject value to null to logout:
        this.user.next(null)
        // navigate back to login page after logging out:
        this.router.navigate(['/auth'])
        // clear the user data
        localStorage.removeItem('userData')

        // check if there is any timer present, in other words if this is gets called
        // by the autoLogout. Then clear it here
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer)
        }
        this.tokenExpirationTimer = null
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout()
        }, expirationDuration)
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occured!'
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage)                
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already'
                break;
            // alternatively, you can ignore to giving hint about if email or password was problematic
            // to enhance the security, but just in this example we're specific
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist'
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct'
                break;
        }
        return throwError(errorMessage) 
    }
}
