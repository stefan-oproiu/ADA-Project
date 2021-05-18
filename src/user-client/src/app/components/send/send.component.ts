import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-send',
    templateUrl: './send.component.html',
    styleUrls: ['./send.component.styl'],
})
export class SendComponent implements OnInit, OnDestroy {
    constructor(
        private api: ApiService, 
        private route: ActivatedRoute,
        private snackbar: MatSnackBar,
        private authService: AuthService) {}
    id: string;
    control: FormControl;

    user: any;
    connection: HubConnection;

    ngOnInit(): void {
        this.route.params.subscribe((p) => (this.id = p['id']));
        this.control = new FormControl(0);

        this.api.currentUser().subscribe(user => this.user = user);

        this.connection = new HubConnectionBuilder()
            .withUrl(`${environment.config.realTimeBase}/mobile`, {
                accessTokenFactory: () => this.authService.getToken(),
                withCredentials: false,
            })
            .build();

        this.connection.on(
            'MoneySent',
            (transactionString: string) => {
                this.user.balance -= (JSON.parse(transactionString).amount);
            }
        )
        
        this.connection.start().catch(console.log);
    }

    send() {
        this.api.sendMoney({ targetId: this.id, amount: this.control.value }).subscribe({
            error: err => this.snackbar.open(err.error.message, null, {duration: 3000})
        });
    }

    ngOnDestroy() {
        this.connection.stop().catch(console.log);
    }
}
