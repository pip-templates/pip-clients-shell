import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';

import * as fromSettingsActions from './settings.actions';
import { settingsReducer, settingsInitialState } from './settings.reducer';
import { SettingsState } from './settings.state';
import { EntityState } from '../../../common/models/index';

describe('[Settings] store/reducer', () => {

    let state: SettingsState;

    beforeEach(() => {
        state = cloneDeep(settingsInitialState);
    });

    it('should have initial state', () => {
        expect(settingsReducer(undefined, { type: null })).toEqual(settingsInitialState);
        expect(settingsReducer(settingsInitialState, { type: null })).toEqual(settingsInitialState);
    });

    it('should reduce settings states', () => {
        expect(settingsReducer(state,
            new fromSettingsActions.SettingsInitAction()))
            .toEqual(merge(cloneDeep(state), { error: null, state: EntityState.Progress }));
        expect(settingsReducer(merge(cloneDeep(state), { error: 'error' }),
            new fromSettingsActions.SettingsAbortAction()))
            .toEqual(merge(cloneDeep(state), { error: 'error', state: EntityState.Error }));
        expect(settingsReducer(merge(cloneDeep(state), { settings: { k: 'v' } }),
            new fromSettingsActions.SettingsAbortAction()))
            .toEqual(merge(cloneDeep(state), { settings: { k: 'v' }, state: EntityState.Data }));
        expect(settingsReducer(merge(cloneDeep(state), { settings: {} }),
            new fromSettingsActions.SettingsAbortAction()))
            .toEqual(merge(cloneDeep(state), { settings: {}, state: EntityState.Empty }));
        expect(settingsReducer(merge(cloneDeep(state), { error: 'error' }),
            new fromSettingsActions.SettingsSuccessAction({ k: 'v' })))
            .toEqual(merge(cloneDeep(state), { error: null }));
        expect(settingsReducer(merge(cloneDeep(state), { error: 'error' }),
            new fromSettingsActions.SettingsFailureAction('error')))
            .toEqual(merge(cloneDeep(state), { error: 'error', state: EntityState.Error }));
        expect(settingsReducer(merge(cloneDeep(state), { error: 'error' }),
            new fromSettingsActions.SettingsDataAction({ k: 'v' })))
            .toEqual(merge(cloneDeep(state), { error: null, state: EntityState.Data, settings: { k: 'v' } }));
        expect(settingsReducer(merge(cloneDeep(state), { settings: {} }),
            new fromSettingsActions.SettingsEmptyAction()))
            .toEqual(merge(cloneDeep(state), { error: null, state: EntityState.Empty, settings: {} }));
    });

    it('should reduce settings create states', () => {
        const stateWithError = merge(cloneDeep(settingsInitialState), { error: 'error' });
        expect(settingsReducer(stateWithError,
            new fromSettingsActions.SettingsCreateAction({ settings: { k: 'v' } })))
            .toEqual(merge(cloneDeep(state), { state: EntityState.Progress, settings: { k: 'v' }, error: null }));
        expect(settingsReducer(stateWithError,
            new fromSettingsActions.SettingsCreateSuccessAction({ settings: { k: 'v' } })))
            .toEqual(merge(cloneDeep(state), { state: EntityState.Data, error: null }));
        expect(settingsReducer(settingsInitialState,
            new fromSettingsActions.SettingsCreateFailureAction({ error: 'error' })))
            .toEqual(merge(cloneDeep(state), { state: EntityState.Error, error: 'error' }));
        expect(settingsReducer(stateWithError,
            new fromSettingsActions.SettingsUpdateAction({ settings: { k: 'v' } })))
            .toEqual(merge(cloneDeep(state), { state: EntityState.Progress, settings: { k: 'v' }, error: null }));
        expect(settingsReducer(stateWithError,
            new fromSettingsActions.SettingsUpdateSuccessAction({ settings: { k: 'v' } })))
            .toEqual(merge(cloneDeep(state), { state: EntityState.Data, error: null }));
        expect(settingsReducer(settingsInitialState,
            new fromSettingsActions.SettingsUpdateFailureAction({ error: 'error' })))
            .toEqual(merge(cloneDeep(state), { state: EntityState.Error, error: 'error' }));
    });

});
