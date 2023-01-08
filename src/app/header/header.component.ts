import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { DataStorageService } from "../shared/data-storage.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {
    isAuthenticated = false
    // subscribes to user Subject in auth service to check auth status, see ngOnInit
    private userSub: Subscription

    constructor(
        private dataStorageService: DataStorageService,
        private authService: AuthService,
    ) {}

    ngOnInit(){
        this.userSub = this.authService.user.subscribe(user => {
            this.isAuthenticated = !!user // equals to -> !user ? false : true
            console.log(!user)
            console.log(!!user)
        })    
    }

    onSaveData() {
        this.dataStorageService.storeRecipes()
    }

    onFetchData() {
        this.dataStorageService.fetchRecipes().subscribe()
    }

    onLogout() {
        this.authService.logout()
    }

    ngOnDestroy() {
        this.userSub.unsubscribe()
    }
}