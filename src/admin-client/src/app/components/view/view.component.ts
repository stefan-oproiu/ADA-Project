import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/dtos/transaction';
import { User } from 'src/app/dtos/user';
import { UserService } from 'src/app/services/userService';

@Component({
    selector: 'app-view',
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.styl'],
})
export class ViewComponent implements OnInit {
  
    fullNameColumns = ['fullName'];
  
    transactionColumns = ['sourceFullName', 'arrow', 'targetFullName', 'amount'];
  
    selectedUser?: User;
  
    selectedUserTransactions: Transaction[] = [];
  
    users: User[] = [];
  
    constructor(private userService: UserService) { }
  
    ngOnInit(): void {
        this.userService.getUsers().subscribe(users => this.users = users);
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
            this.userService.getUsers().subscribe(users => {
                this.users = users;
                this.selectedUser = this.users.find(user => user.id = selectedUserId);
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
  