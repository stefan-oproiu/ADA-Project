import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class URLHelper {

    static GET_FULL_USERS_URL = '/api/banking/users/full';

    static SEND_MONEY_URL = '/api/banking/users/fill';

}
