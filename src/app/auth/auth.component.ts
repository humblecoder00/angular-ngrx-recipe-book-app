import {
    Component,
    ComponentFactoryResolver,
    OnInit,
    OnDestroy,
    ViewChild,
} from '@angular/core'
import { NgForm } from '@angular/forms'
import { Store } from '@ngrx/store'
import { Subscription } from 'rxjs'

import * as fromApp from '../store/app.reducer'
import * as AuthActions from './store/auth.actions'
import { AlertComponent } from '../shared/alert/alert.component'
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive'

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit, OnDestroy {
    isLoginMode = true
    isLoading = false
    error: string = null
    // 'PlaceholderDirective' finds the first occurence in the DOM
    @ViewChild(PlaceholderDirective, { static: false })
    alertHost: PlaceholderDirective

    // dynamic component subscription ref:
    private closeSub: Subscription
    // store subscription
    private storeSub: Subscription

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private store: Store<fromApp.AppState>
    ) {}

    ngOnInit() {
        // Track and Update the UI state with a subscription to Auth state:
        this.storeSub = this.store.select('auth').subscribe((authState) => {
            this.isLoading = authState.loading
            this.error = authState.authError
            if (this.error) {
                this.showErrorAlert(this.error)
            }
        })
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode
    }

    onSubmit(form: NgForm) {
        // extra validation step in case if user manipulates the disabled prop on browser dev tools
        if (!form.valid) {
            return
        }
        const email = form.value.email
        const password = form.value.password

        if (this.isLoginMode) {
            this.store.dispatch(new AuthActions.LoginStart({ email, password }))
        } else {
            this.store.dispatch(
                new AuthActions.SignupStart({ email, password })
            )
        }

        form.reset()
    }

    onHandleError() {
        this.store.dispatch(new AuthActions.ClearError())
    }

    private showErrorAlert(message: string) {
        // this returns a component factory - so it is something just knows how to create components:
        const alertCompFactory =
            this.componentFactoryResolver.resolveComponentFactory(
                AlertComponent
            )

        // get the component to be attached via defined PlaceholderDirective reference (alertHost):
        const hostViewContainerRef = this.alertHost.viewContainerRef

        // clear anything that might have been rendered there before,
        // clear before you render anything something new:
        hostViewContainerRef.clear()

        // createComponent takes the component factory as argument:
        const componentRef =
            hostViewContainerRef.createComponent(alertCompFactory)

        // Pass props & events
        componentRef.instance.message = message
        this.closeSub = componentRef.instance.close.subscribe(() => {
            // clear it here - because the component will be removed with the close method
            this.closeSub.unsubscribe()

            // clear the all content rendered on the parent comp:
            hostViewContainerRef.clear()
        })
    }

    ngOnDestroy() {
        if (this.closeSub) {
            this.closeSub.unsubscribe()
        }
        if (this.storeSub) {
            this.storeSub.unsubscribe()
        }
    }
}
