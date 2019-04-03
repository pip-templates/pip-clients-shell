import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';

import * as fromNotificationsActions from './notifications.actions';
import { notificationsReducer, notificationsInitialState } from './notifications.reducer';
import { NotificationsState } from './notifications.state';
import { Notification } from '../models/index';
import { EntityState, DataPage } from '../../../common/models/index';
import { notifications } from '../../../mock/index';

describe('[Notifications] store/reducer', () => {

    let state: NotificationsState;

    beforeEach(() => {
        state = cloneDeep(notificationsInitialState);
    });

    it('should have initial state', () => {
        expect(notificationsReducer(undefined, { type: null })).toEqual(notificationsInitialState);
        expect(notificationsReducer(notificationsInitialState, { type: null })).toEqual(notificationsInitialState);
    });

    it('should reduce notifications states', () => {
        expect(notificationsReducer(notificationsInitialState,
            new fromNotificationsActions.NotificationsInitAction()))
            .toEqual(merge(cloneDeep(state), { state: EntityState.Progress, error: null }));
        expect(notificationsReducer(merge(cloneDeep(state), { error: 'error' }),
            new fromNotificationsActions.NotificationsAbortAction()))
            .toEqual(merge(cloneDeep(state), { error: 'error', state: EntityState.Error }));
        expect(notificationsReducer(merge(cloneDeep(state), { notifications: notifications }),
            new fromNotificationsActions.NotificationsAbortAction()))
            .toEqual(merge(cloneDeep(state), { notifications: notifications, state: EntityState.Data }));
        expect(notificationsReducer(merge(cloneDeep(state), { notifications: [] }),
            new fromNotificationsActions.NotificationsAbortAction()))
            .toEqual(merge(cloneDeep(state), { notifications: [], state: EntityState.Empty }));
        expect(notificationsReducer(merge(cloneDeep(state), { error: 'error' }),
            new fromNotificationsActions.NotificationsSuccessAction(<DataPage<Notification>>{
                total: notifications.length,
                data: notifications
            })))
            .toEqual(notificationsInitialState);
        expect(notificationsReducer(notificationsInitialState,
            new fromNotificationsActions.NotificationsFailureAction('error')))
            .toEqual(merge(cloneDeep(state), { error: 'error', state: EntityState.Error }));
        expect(notificationsReducer(notificationsInitialState,
            new fromNotificationsActions.NotificationsDataAction(<DataPage<Notification>>{
                total: notifications.length,
                data: notifications
            })))
            .toEqual(merge(cloneDeep(state), { notifications: notifications, state: EntityState.Data, count: notifications.length }));
        expect(notificationsReducer(notificationsInitialState,
            new fromNotificationsActions.NotificationsEmptyAction()))
            .toEqual(merge(cloneDeep(state), { notifications: [], state: EntityState.Empty, count: 0 }));
    });

    it('should reduce notifications count states', () => {
        expect(notificationsReducer(notificationsInitialState,
            new fromNotificationsActions.NotificationsCountInitAction()
        )).toEqual(notificationsInitialState);
        expect(notificationsReducer(notificationsInitialState,
            new fromNotificationsActions.NotificationsCountAbortAction()
        )).toEqual(notificationsInitialState);
        expect(notificationsReducer(notificationsInitialState,
            new fromNotificationsActions.NotificationsCountSuccessAction(notifications.length)
        )).toEqual(merge(cloneDeep(state), { count: notifications.length }));
        expect(notificationsReducer(notificationsInitialState,
            new fromNotificationsActions.NotificationsCountFailureAction('error')
        )).toEqual(merge(cloneDeep(state), { error: 'error' }));
    });
});
