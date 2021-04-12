import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {User} from '../dtos/user';
import {NEW_USERS, USERS} from '../mockup/mockUsers';
import {SendMoney} from '../dtos/sendMoney';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class UserService {

    constructor(private http: HttpClient) { }

    getUsers(): Observable<User[]> {
        return of(USERS);
    }

    getNewUsers(): Observable<User[]> {
        return of(NEW_USERS);
    }

    sendMoney(targetId: string, amount: number): void {
        const sendMoney: SendMoney = {
            targetId,
            amount
        };
    }

}
