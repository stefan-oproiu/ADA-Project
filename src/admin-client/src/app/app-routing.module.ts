import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SigninCallbackComponent } from './components/signin-callback/signin-callback.component';
import { ViewComponent } from './components/view/view.component';

const routes: Routes = [
    {
        path: '', component: LoginComponent
    },
    {
        path: 'view', component: ViewComponent,
    },
    {
        path: 'signin-callback', component: SigninCallbackComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
