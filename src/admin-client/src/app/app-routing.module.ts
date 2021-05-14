import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewComponent } from './components/view/view.component';

const routes: Routes = [
    {
        path: '', pathMatch: 'full', redirectTo: 'view'
    },
    {
        path: 'view', component: ViewComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
