import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.styl'],
})
export class LoginComponent implements OnInit {
    constructor(private auth: AuthService) {}

    ngOnInit(): void {}

    onClick() {
        this.auth.login()
    }
}
