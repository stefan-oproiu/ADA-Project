import {Injectable} from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class URLHelper {

    static GET_FULL_USERS_URL = `${environment.config.bankingBase}/users/full`;

    static SEND_MONEY_URL = `${environment.config.bankingBase}/users/fill`;

}
