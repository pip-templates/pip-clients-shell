import { Injectable, Inject } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { LocalStorageService } from 'angular-2-local-storage';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as fromSessionActions from './session.actions';
import { SessionConfig, SESSION_CONFIG } from '../models/SessionConfig';
import { Session } from '../models/index';
import { SessionDataService } from '../services/session.data.service';
import { WINDOW, WindowWrapper } from '../../../common/services/window.service';

@Injectable()
export class SessionEffects {
    constructor(
        private actions$: Actions,
        @Inject(SESSION_CONFIG) private config: SessionConfig,
        @Inject(WINDOW) private window: WindowWrapper,
        private sessionDataService: SessionDataService,
        private localStorageService: LocalStorageService,
    ) { }

    @Effect() SessionSigninInit$: Observable<Action> = this.actions$.pipe(
        ofType(
            fromSessionActions.SessionActionType.SessionSigninInit,
            fromSessionActions.SessionActionType.SessionSigninAbort
        ),
        switchMap((action: any) => {
            if (action.type === fromSessionActions.SessionActionType.SessionSigninInit) {
                return this.sessionDataService.signin(action.login, action.password)
                    .pipe(
                        map(data => new fromSessionActions.SessionSigninSuccessAction(data)),
                        catchError(error => of(new fromSessionActions.SessionSigninFailureAction(error)))
                    );
            } else {
                return of();
            }
        })
    );

    @Effect() SessionSignoutInit$: Observable<Action> = this.actions$.pipe(
        ofType(
            fromSessionActions.SessionActionType.SessionSignoutInit,
            fromSessionActions.SessionActionType.SessionSignoutAbort
        ),
        switchMap((action: fromSessionActions.SessionSignoutInitAction | fromSessionActions.SessionSignoutAbortAction) => {
            if (action.type === fromSessionActions.SessionActionType.SessionSignoutInit) {
                return this.sessionDataService.signout().pipe(
                    map(() => new fromSessionActions.SessionSignoutSuccessAction()),
                    catchError(error => of(new fromSessionActions.SessionSignoutFailureAction(error)))
                );
            } else {
                return of();
            }
        })
    );

    @Effect() SessionRestoreInit$: Observable<Action> = this.actions$.pipe(
        ofType(fromSessionActions.SessionActionType.SessionRestoreInit),
        switchMap((action: fromSessionActions.SessionRestoreInitAction) => {
            return this.sessionDataService.restore(action.payload)
                .pipe(
                    map(data => new fromSessionActions.SessionRestoreSuccessAction(data)),
                    catchError(error => of(new fromSessionActions.SessionRestoreFailureAction(error)))
                );

        })
    );

    @Effect() SessionCloseAllInit$: Observable<Action> = this.actions$.pipe(
        ofType(fromSessionActions.SessionActionType.SessionCloseAllInit),
        switchMap((action: fromSessionActions.SessionCloseAllInitAction) => {
            return this.sessionDataService.closeAll()
                .pipe(
                    map(() => new fromSessionActions.SessionCloseAllSuccessAction()),
                    catchError(error => of(new fromSessionActions.SessionCloseAllFailureAction(error)))
                );
        })
    );

    @Effect({ dispatch: false }) SessionSaveSession$: Observable<void> = this.actions$.pipe(
        ofType(
            fromSessionActions.SessionActionType.SessionSigninSuccess,
            fromSessionActions.SessionActionType.SessionRestoreSuccess,
        ),
        map((action: any) => {
            this.saveSession(action.payload);
        })
    );

    @Effect({ dispatch: false }) SessionCloseSession$: Observable<void> = this.actions$.pipe(
        ofType(
            fromSessionActions.SessionActionType.SessionSignoutSuccess,
            fromSessionActions.SessionActionType.SessionRestoreFailure,
            fromSessionActions.SessionActionType.SessionCloseAllSuccess
        ),
        map((action: any) => {
            this.closeSession();
        })
    );

    @Effect({ dispatch: false }) SessionToAuthorizedUrl$: Observable<void> = this.actions$.pipe(
        ofType(fromSessionActions.SessionActionType.SessionSigninSuccess),
        map(() => {
            this.window.location.href = this.window.location.origin + this.config.autorizedUrl;
        })
    );

    @Effect({ dispatch: false }) SessionToUnauthorizedUrl$: Observable<void> = this.actions$.pipe(
        ofType(
            fromSessionActions.SessionActionType.SessionSignoutSuccess,
            fromSessionActions.SessionActionType.SessionRestoreFailure,
            fromSessionActions.SessionActionType.SessionCloseAllSuccess
        ),
        map(() => {
            this.window.location.href = this.window.location.origin + this.config.unautorizedUrl;
        })
    );

    private saveSession(session: Session): void {
        this.localStorageService.set(this.config.lsSessionKey, session);
    }

    private closeSession(): void {
        this.localStorageService.remove(this.config.lsSessionKey);
    }
}
