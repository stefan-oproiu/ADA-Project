import { Injectable } from '@angular/core';
import { UserManager, User, UserManagerSettings } from 'oidc-client';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private _userManager: UserManager;
    private _user: User;
    private _loginChangedSubject = new Subject<boolean>();
    public loginChanged = this._loginChangedSubject.asObservable();

    private get idpSettings(): UserManagerSettings {
        return {
            authority: environment.config.identity,
            client_id: environment.config.clientId,
            redirect_uri: environment.config.clientSignInCallback,
            scope: 'openid profile admin',
            response_type: 'code',
            post_logout_redirect_uri: environment.config.clientLogoutCallback,
        };
    }
    constructor() {
        this._userManager = new UserManager(this.idpSettings);
    }

    public login = () => {
        return this._userManager.signinRedirect();
    };

    public getToken() {
        return this._user.access_token;
    }

    public isAuthenticated = (): Promise<boolean> => {
        return this._userManager.getUser().then((user) => {
            if (this._user !== user) {
                this._loginChangedSubject.next(this.checkUser(user));
            }

            this._user = user;
            return this.checkUser(user);
        });
    };

    public finishLogin = (): Promise<User> => {
        return this._userManager.signinRedirectCallback().then((user) => {
            this._user = user;
            this._loginChangedSubject.next(this.checkUser(user));
            return user;
        });
    };

    private checkUser = (user: User): boolean => {
        return !!user && !user.expired;
    };
}
