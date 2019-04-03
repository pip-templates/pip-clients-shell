import { Injectable, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { LocalStorageService } from 'angular-2-local-storage';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import {
    SessionState,
    SessionCloseAllInitAction,
    SessionSigninInitAction,
    SessionSigninAbortAction,
    SessionSignoutInitAction,
    SessionRestoreInitAction,
    getSessionSession,
    getSessionState,
    getSessionError,
} from '../store/index';
import { Session } from '../models/index';
import { SessionConfig, SESSION_CONFIG } from '../models/SessionConfig';
import { EntityState } from '../../../common/index';
import { WINDOW, WindowWrapper } from '../../../common/services/window.service';

@Injectable()
export class SessionService {

    constructor(
        @Inject(SESSION_CONFIG) private config: SessionConfig,
        @Inject(WINDOW) private window: WindowWrapper,
        private localStorageService: LocalStorageService,
        private store: Store<SessionState>
    ) { }

    public get session$(): Observable<Session> {
        return this.store.select(getSessionSession);
    }

    public get state$(): Observable<EntityState> {
        return this.store.select(getSessionState);
    }

    public get error$(): Observable<any> {
        return this.store.select(getSessionError);
    }

    public get session(): Session {
        let session;
        this.session$.pipe(first()).subscribe(s => session = s);
        return session;
    }

    public get isAuthorized$(): Observable<boolean> {
        return this.state$.pipe(map(state => state === EntityState.Data));
    }

    public signin(login: string, password: string) {
        this.store.dispatch(new SessionSigninInitAction(login, password));
    }

    public abortSignin() {
        this.store.dispatch(new SessionSigninAbortAction());
    }

    public signout() {
        this.store.dispatch(new SessionSignoutInitAction());
    }

    public restore() {
        const session = <Session>this.localStorageService.get(this.config.lsSessionKey);
        if (session && this.config.serverUrl) {
            this.store.dispatch(new SessionRestoreInitAction(session));
        } else {
            this.window.location.href = this.window.location.origin + this.config.unautorizedUrl;
        }
    }

    public closeAll() {
        this.store.dispatch(new SessionCloseAllInitAction());
    }
}
