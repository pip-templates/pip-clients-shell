import { fromJS } from 'immutable';

import { SettingsActionType, SettingsAction } from './settings.actions';
import { SettingsState } from './settings.state';
import { EntityState } from '../../../common/index';

export const settingsInitialState: SettingsState = {
    settings: {},
    state: EntityState.Empty,
    error: null,
};

export function settingsReducer(
    state: SettingsState = settingsInitialState,
    action: SettingsAction
): SettingsState {
    switch (action.type) {

        case SettingsActionType.SettingsInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            map = map.set('error', null);
            return <SettingsState>map.toJS();
        }

        case SettingsActionType.SettingsAbort: {
            let map = fromJS(state);
            map = map.set('state', state.error
                ? EntityState.Error
                : state.settings && Object.keys(state.settings).length > 0
                    ? EntityState.Data
                    : EntityState.Empty);
            return <SettingsState>map.toJS();
        }

        case SettingsActionType.SettingsSuccess: {
            let map = fromJS(state);
            map = map.set('error', null);
            return <SettingsState>map.toJS();
        }

        case SettingsActionType.SettingsFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload);
            return <SettingsState>map.toJS();
        }

        case SettingsActionType.SettingsData: {
            let map = fromJS(state);
            map = map.set('settings', action.payload);
            map = map.set('state', EntityState.Data);
            map = map.set('error', null);
            return <SettingsState>map.toJS();
        }

        case SettingsActionType.SettingsEmpty: {
            let map = fromJS(state);
            map = map.set('settings', {});
            map = map.set('state', EntityState.Empty);
            map = map.set('error', null);
            return <SettingsState>map.toJS();
        }

        case SettingsActionType.SettingsCreate: {
            let map = fromJS(state);
            map = map.set('settings', action.payload.settings);
            map = map.set('state', EntityState.Progress);
            map = map.set('error', null);
            return <SettingsState>map.toJS();
        }

        case SettingsActionType.SettingsCreateSuccess: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Data);
            map = map.set('error', null);
            return <SettingsState>map.toJS();
        }

        case SettingsActionType.SettingsCreateFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload.error);
            return <SettingsState>map.toJS();
        }

        case SettingsActionType.SettingsUpdate: {
            let map = fromJS(state);
            map = map.set('settings', action.payload.settings);
            map = map.set('state', EntityState.Progress);
            map = map.set('error', null);
            return <SettingsState>map.toJS();
        }

        case SettingsActionType.SettingsUpdateSuccess: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Data);
            map = map.set('error', null);
            return <SettingsState>map.toJS();
        }

        case SettingsActionType.SettingsUpdateFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload.error);
            return <SettingsState>map.toJS();
        }

        default: {
            return state;
        }
    }
}
