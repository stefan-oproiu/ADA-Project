import { Component, OnDestroy, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Transaction } from 'src/app/dtos/transaction';
import { User } from 'src/app/dtos/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/userService';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-view',
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.styl'],
})
export class ViewComponent implements OnInit, OnDestroy {
    fullNameColumns = ['fullName'];

    transactionColumns = [
        'sourceFullName',
        'arrow',
        'targetFullName',
        'amount',
    ];

    selectedUser?: User;

    selectedUserTransactions: Transaction[] = [];

    users: User[] = [];

    connection: HubConnection;

    constructor(
        private userService: UserService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.userService.getUsers().subscribe((users) => (this.users = users));
        this.connection = new HubConnectionBuilder()
            .withUrl(`${environment.config.realTimeBase}/admin`, {
                accessTokenFactory: () => this.authService.getToken(),
                withCredentials: false,
            })
            .build();

        this.connection.on(
            'TransactionCompleted',
            (transactionString: string) => {
                const transaction = JSON.parse(
                    transactionString
                ) as Transaction;

                const sourceUser = this.users.find(
                    (u) => u.id == transaction.sourceId
                );
                const targetUser = this.users.find(
                    (u) => u.id == transaction.targetId
                );

                if (sourceUser) {
                    sourceUser.balance -= transaction.amount;
                }
                if (targetUser) {
                    targetUser.balance += transaction.amount;
                }

                this.users
                    .filter(
                        (u) =>
                            u.id == transaction.sourceId ||
                            u.id == transaction.targetId
                    )
                    .map((u) => {
                        u.transactions.push(transaction as Transaction);
                        return u;
                    });
                this.selectedUserTransactions = [
                    ...this.selectedUser.transactions,
                ];
            }
        );

        this.connection.start().catch(console.log);
    }

    ngOnDestroy(): void {
        this.connection.stop().catch(console.log);
    }

    onSelect(user: User): void {
        this.selectedUser = user;
        // @ts-ignore
        this.selectedUserTransactions = this.selectedUser.transactions;
    }

    sendMoney(amount: string): void {
        // @ts-ignore
        const selectedUserId: string = this.selectedUser.id;
        if (this.userService.sendMoney(selectedUserId, +amount)) {
            this.pseudoUpdateSelectedUser(+amount);
            this.userService.getUsers().subscribe((users) => {
                this.users = users;
                this.selectedUser = this.users.find(
                    (user) => (user.id = selectedUserId)
                );
                // @ts-ignore
                this.selectedUserTransactions = this.selectedUser.transactions;
            });
        }
    }

    private pseudoUpdateSelectedUser(withdrawnMoney: number): void {
        // @ts-ignore
        this.selectedUser.balance += withdrawnMoney;
    }
}
