import {Injectable} from '@angular/core';
import {EMPTY, Observable, of} from 'rxjs';
import {User} from '../dtos/user';
import {SendMoney} from '../dtos/sendMoney';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {URLHelper} from '../helpers/URLHelper';
import {ToastrService} from 'ngx-toastr';
import {tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class UserService {

    constructor(private http: HttpClient, private toasterService: ToastrService) { }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${URLHelper.GET_FULL_USERS_URL}`).pipe(
            tap(users => users.forEach(u => u.transactions?.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())))
        );
    }

    sendMoney(targetId: string, amount: number): boolean {
        let operationSuccessful = false;
        const sendMoney: SendMoney = {
            targetId,
            amount
        };
        this.http.post<SendMoney>(`${URLHelper.SEND_MONEY_URL}`, sendMoney)
            .subscribe({
                next: () => {
                    this.toasterService.info('Money sent', '', {
                        timeOut: 3000,
                    });
                    operationSuccessful = true;
                },
                error: error => {
                    this.handleError(error);
                    operationSuccessful = false;
                }});
        return operationSuccessful;
    }

    private handleError(error: HttpErrorResponse): Observable<User[]> {
        let errorMessage: string;
        switch (error.status) {
            case 504 : {
                errorMessage = 'Operation couldn\'t be executed.' +
                    '</br> ' +
                    'Please contact your System Administrator';
                break;
            }
            case 404 : {
                errorMessage = 'Operation couldn\'t be executed.' +
                    '</br> ' +
                    'Please contact your System Administrator';
                break;
            }
            case 300 : {
                errorMessage = 'Operation couldn\'t be executed.' +
                    '</br> ' +
                    'Please contact your System Administrator';
                break;
            }
        }
        // @ts-ignore
        this.toasterService.error(errorMessage, '', {
            timeOut: 3000, enableHtml: true
        });
        return EMPTY;
    }

}
