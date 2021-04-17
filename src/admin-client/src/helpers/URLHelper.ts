import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class URLHelper {

    static WEBHOOK_URL = 'http://localhost:???';

    static GET_FULL_USERS_URL = URLHelper.WEBHOOK_URL + '/???';

    static SEND_MONEY_URL = URLHelper.WEBHOOK_URL + '/???';

}
