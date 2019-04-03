import { fromJS } from 'immutable';

import { NotificationsActionType, NotificationsAction } from './notifications.actions';
import { NotificationsState } from './notifications.state';
import { EntityState } from '../../../common/index';

export const notificationsInitialState: NotificationsState = {
    notifications: [],
    count: 0,
    state: EntityState.Empty,
    error: null,
};

export function notificationsReducer(
    state = notificationsInitialState,
    action: NotificationsAction
): NotificationsState {
    switch (action.type) {
        case NotificationsActionType.NotificationsInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            map = map.set('error', null);
            return <NotificationsState>map.toJS();
        }

        case NotificationsActionType.NotificationsAbort: {
            let map = fromJS(state);
            map = map.set('state',
                state.error
                    ? EntityState.Error
                    : state.notifications && state.notifications.length
                        ? EntityState.Data
                        : EntityState.Empty);
            return <NotificationsState>map.toJS();
        }

        case NotificationsActionType.NotificationsSuccess: {
            let map = fromJS(state);
            map = map.set('error', null);
            return <NotificationsState>map.toJS();
        }

        case NotificationsActionType.NotificationsFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload);
            return <NotificationsState>map.toJS();
        }

        case NotificationsActionType.NotificationsData: {
            let map = fromJS(state);
            map = map.set('notifications', action.payload.data);
            map = map.set('count', action.payload.total);
            map = map.set('state', EntityState.Data);
            return <NotificationsState>map.toJS();
        }

        case NotificationsActionType.NotificationsEmpty: {
            let map = fromJS(state);
            map = map.set('notifications', []);
            map = map.set('count', 0);
            map = map.set('state', EntityState.Empty);
            return <NotificationsState>map.toJS();
        }

        case NotificationsActionType.NotificationsCountSuccess: {
            let map = fromJS(state);
            map = map.set('count', action.payload);
            map = map.set('error', null);
            return <NotificationsState>map.toJS();
        }

        case NotificationsActionType.NotificationsCountFailure: {
            let map = fromJS(state);
            map = map.set('error', action.payload);
            return <NotificationsState>map.toJS();
        }

        default: {
            return state;
        }
    }
}
