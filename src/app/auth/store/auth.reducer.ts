import { User } from '../user.model'
import * as AuthActions from './auth.actions'

export interface State {
    user: User
    authError: string
    loading: boolean
}

const initalState: State = {
    user: null,
    authError: null,
    loading: false,
}

export function authReducer(
    state = initalState,
    action: AuthActions.AuthActions
) {
    switch (action.type) {
        case AuthActions.AUTHENTICATE_SUCCESS:
            const user = new User(
                action.payload.email,
                action.payload.userId,
                action.payload.token,
                action.payload.expirationDate
            )

            return {
                ...state,
                authError: null,
                user,
                loading: false,
            }

        case AuthActions.LOGOUT:
            return {
                ...state,
                user: null, // simply cleanup the user
            }
        // You can group same effects together as seen below (login & signup start)
        // because both are cleaning up error & setting loading to true:
        case AuthActions.LOGIN_START:
        case AuthActions.SIGNUP_START:
            return {
                ...state,
                authError: null,
                loading: true,
            }
        case AuthActions.AUTHENTICATE_FAIL:
            return {
                ...state,
                user: null,
                authError: action.payload,
                loading: false,
            }
        case AuthActions.CLEAR_ERROR:
            return {
                ...state,
                authError: null,
            }
        default:
            return state
    }
}
