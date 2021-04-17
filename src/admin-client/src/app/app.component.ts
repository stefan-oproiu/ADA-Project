import {Component, OnInit} from '@angular/core';
import {User} from './dtos/user';
import {UserService} from './services/userService';
import {Transaction} from './dtos/transaction';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent implements OnInit {
  title = 'admin-client';

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
