import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
    isLoginMode = true
    isLoading = false
    error: string = null
    // 'PlaceholderDirective' finds the first occurence in the DOM
    @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective

    // dynamic component subscription ref:
    private closeSub: Subscription

    constructor(
        private authService: AuthService,
        private router: Router,
        private componentFactoryResolver: ComponentFactoryResolver
    ) { }

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

        let authObs: Observable<AuthResponseData>

        this.isLoading = true

        if (this.isLoginMode) {
            authObs = this.authService.login(email, password)
        } else {
            authObs = this.authService.signup(email, password)
        }

        authObs.subscribe(
            resData => {
                console.log('RES', resData)
                this.isLoading = false
                // navigate to recipes if login or signup is successful
                this.router.navigate(['/recipes'])
            }, 
            // error is handled in the auth.service, and we only get a message
            errorMessage => {
                console.log('ERR', errorMessage)
                this.error = errorMessage
                // set the error alert comp programmatically
                this.showErrorAlert(errorMessage)
                this.isLoading = false
            })


        form.reset()
    }

    onHandleError() {
        this.error = null
    }

    private showErrorAlert(message: string) {
        // this returns a component factory - so it is something just knows how to create components:
        const alertCompFactory = this.componentFactoryResolver.resolveComponentFactory(
            AlertComponent
        )

        // get the component to be attached via defined PlaceholderDirective reference (alertHost):
        const hostViewContainerRef = this.alertHost.viewContainerRef
        
        // clear anything that might have been rendered there before,
        // clear before you render anything something new:
        hostViewContainerRef.clear()

        // createComponent takes the component factory as argument:
        const componentRef = hostViewContainerRef.createComponent(alertCompFactory)

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
    }
}