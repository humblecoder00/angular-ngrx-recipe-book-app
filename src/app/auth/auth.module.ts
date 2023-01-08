import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { SharedModule } from "../shared/shared.module";
import { AuthComponent } from "./auth.component";

@NgModule({
    // add components
    declarations: [
        AuthComponent
    ],
    // add CommonModule instead of BrowserModule in your feature modules
    imports: [
        SharedModule,
        FormsModule,
        RouterModule.forChild([
            { path: '', component: AuthComponent}
        ]),
    ],
    exports: []
})

export class AuthModule {}