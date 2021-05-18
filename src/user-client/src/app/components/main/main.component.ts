import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.styl'],
})
export class MainComponent implements OnInit {
    users: any[];
    user: any;

    constructor(private apiService: ApiService) {}

    ngOnInit(): void {
        

        this.apiService.currentUser().subscribe(user => {
            this.user = user;
            this.apiService.getUsers().subscribe((users) => (this.users = users.filter(u => u.id !== user.id)));
        });
    }
}
