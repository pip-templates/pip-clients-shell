import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import find from 'lodash/find';
import { PipNavService } from 'pip-webui2-nav';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { NotificationsDataService } from '../services/notifications.data.service';
import { Notification } from '../models/index';
import * as actionsFromNotifications from './notifications.actions';
import { DataPage } from '../../../common/index';

@Injectable()
export class NotificationsEffects {
    constructor(
        private actions$: Actions,
        private navService: PipNavService,
        private notificationsDataService: NotificationsDataService,
    ) { }

    @Effect() notifications$: Observable<Action> = this.actions$.pipe(
        ofType(
            actionsFromNotifications.NotificationsActionType.NotificationsInit,
            actionsFromNotifications.NotificationsActionType.NotificationsAbort
        ),
        switchMap((action: actionsFromNotifications.NotificationsInitAction | actionsFromNotifications.NotificationsAbortAction) => {
            if (action.type !== actionsFromNotifications.NotificationsActionType.NotificationsAbort) {
                return this.notificationsDataService.readNotifications()
                    .pipe(
                        map((notifications: DataPage<Notification>) => {
                            return new actionsFromNotifications.NotificationsSuccessAction(notifications);
                        }),
                        catchError(error => of(new actionsFromNotifications.NotificationsFailureAction(error)))
                    );
            } else {
                return of();
            }
        })
    );

    @Effect() notificationsSuccess$: Observable<Action> = this.actions$.pipe(
        ofType(actionsFromNotifications.NotificationsActionType.NotificationsSuccess),
        map((action: actionsFromNotifications.NotificationsSuccessAction) => {
            if (action.payload && action.payload.total > 0) {
                return new actionsFromNotifications.NotificationsDataAction(action.payload);
            } else {
                return new actionsFromNotifications.NotificationsEmptyAction();
            }
        })
    );

    @Effect() notificationsCount$: Observable<Action> = this.actions$.pipe(
        ofType(
            actionsFromNotifications.NotificationsActionType.NotificationsCountInit,
            actionsFromNotifications.NotificationsActionType.NotificationsCountAbort
        ),
        switchMap((action: actionsFromNotifications.NotificationsCountInitAction
            | actionsFromNotifications.NotificationsCountAbortAction) => {
            if (action.type !== actionsFromNotifications.NotificationsActionType.NotificationsCountAbort) {
                return this.notificationsDataService.readNotificationsCount()
                    .pipe(
                        map((count: number) => {
                            return new actionsFromNotifications.NotificationsCountSuccessAction(count);
                        }),
                        catchError(error => of(new actionsFromNotifications.NotificationsCountFailureAction(error)))
                    );
            } else {
                return of();
            }
        })
    );

    @Effect({ dispatch: false }) notificationsCountSuccess$: Observable<void> = this.actions$.pipe(
        ofType(actionsFromNotifications.NotificationsActionType.NotificationsCountSuccess),
        map((action: actionsFromNotifications.NotificationsCountSuccessAction) => {
            const pa = this.navService.getItem('primary-actions');
            if (pa) {
                const actions = pa.properties.getValue()['actions'];
                const notifications = find(actions, ['icon', 'notifications']);
                if (notifications) {
                    notifications.count = action.payload;
                    this.navService.updateItemByName('primary-actions', { actions });
                }
            }
        })
    );
}
