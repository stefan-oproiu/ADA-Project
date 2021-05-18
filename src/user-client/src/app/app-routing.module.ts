import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { SendComponent } from './components/send/send.component';
import { SigninCallbackComponent } from './components/signin-callback/signin-callback.component';

const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'main', component: MainComponent },
    { path: 'signin-callback', component: SigninCallbackComponent },
    {
        path: 'send',
        children: [
            {
                path: ':id',
                component: SendComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
