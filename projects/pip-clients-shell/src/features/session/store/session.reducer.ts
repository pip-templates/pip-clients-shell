import { fromJS } from 'immutable';

import { SessionActionType, SessionAction } from './session.actions';
import { SessionState } from './session.state';
import { EntityState } from '../../../common/index';

export const sessionInitialState: SessionState = {
    session: null,
    state: EntityState.Empty,
    error: null
};

export function sessionReducer(
    state: SessionState = sessionInitialState,
    action: SessionAction
): SessionState {
    switch (action.type) {

        case SessionActionType.SessionSigninInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            map = map.set('error', null);
            return <SessionState>map.toJS();
        }

        case SessionActionType.SessionSigninAbort: {
            let map = fromJS(state);
            map = map.set('state', state.error ? EntityState.Error : state.session ? EntityState.Data : EntityState.Empty);
            return <SessionState>map.toJS();
        }

        case SessionActionType.SessionSigninSuccess: {
            let map = fromJS(state);
            map = map.set('session', action.payload);
            map = map.set('state', EntityState.Data);
            map = map.set('error', null);
            return <SessionState>map.toJS();
        }

        case SessionActionType.SessionSigninFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload);
            return <SessionState>map.toJS();
        }

        case SessionActionType.SessionSignoutInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            return <SessionState>map.toJS();
        }

        case SessionActionType.SessionSignoutAbort: {
            let map = fromJS(state);
            map = map.set('state', state.error ? EntityState.Error : state.session ? EntityState.Data : EntityState.Empty);
            return <SessionState>map.toJS();
        }

        case SessionActionType.SessionSignoutSuccess: {
            let map = fromJS(state);
            map = map.set('session', null);
            map = map.set('state', EntityState.Empty);
            map = map.set('error', null);
            return <SessionState>map.toJS();
        }

        case SessionActionType.SessionSignoutFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload);
            return <SessionState>map.toJS();
        }

        case SessionActionType.SessionRestoreInit: {
            let map = fromJS(state);
            map = map.set('session', action.payload);
            map = map.set('state', EntityState.Progress);
            map = map.set('error', null);
            return <SessionState>map.toJS();
        }

        case SessionActionType.SessionRestoreSuccess: {
            let map = fromJS(state);
            map = map.set('session', action.payload);
            map = map.set('state', EntityState.Data);
            map = map.set('error', null);
            return <SessionState>map.toJS();
        }

        case SessionActionType.SessionRestoreFailure: {
            let map = fromJS(state);
            map = map.set('session', null);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload);
            return <SessionState>map.toJS();
        }

        case SessionActionType.SessionCloseAllInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            map = map.set('error', null);
            return <SessionState>map.toJS();
        }

        case SessionActionType.SessionCloseAllSuccess: {
            let map = fromJS(state);
            map = map.set('session', null);
            map = map.set('state', EntityState.Empty);
            map = map.set('error', null);
            return <SessionState>map.toJS();
        }

        case SessionActionType.SessionCloseAllFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload);
            return <SessionState>map.toJS();
        }

        default: {
            return state;
        }
    }
}
