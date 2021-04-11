import {Component, OnInit} from '@angular/core';
import {User} from '../dtos/user';
import {UserService} from '../services/userService';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent implements OnInit {
  title = 'admin-client';

  selectedUser?: User;

  users: User[] = [];

  constructor(private userService: UserService, private toasterService: ToastrService) { }

  ngOnInit(): void {
      this.userService.getUsers().subscribe(users => this.users = users);
  }

  onSelect(user: User): void {
      this.selectedUser = user;
  }

  sendMoney(amount: string): void {
      // @ts-ignore
      const selectedUserId: string = this.selectedUser.id;
      // @ts-ignore
      this.userService.sendMoney(selectedUserId, +amount);
      this.toasterService.info('Money sent', '', {
          timeOut: 3000,
      });
      this.pseudoUpdateSelectedUser(+amount);
      this.userService.getNewUsers().subscribe(users => {
          this.users = users;
          this.selectedUser = this.users.find(user => user.id = selectedUserId);
      });
  }

  private pseudoUpdateSelectedUser(withdrownMoney: number): void {
      // @ts-ignore
      this.selectedUser.balance += withdrownMoney;
  }
}
