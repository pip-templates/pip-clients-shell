import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EntityState } from '../../../common/index';

export interface SettingsState {
    settings: Object;
    state: EntityState;
    error: any;
}

export const getSettingsState = createFeatureSelector<SettingsState>('settings');

export const getSettingsData = createSelector(getSettingsState, (state: SettingsState) => state.settings);
export const getSettingsEntityState = createSelector(getSettingsState, (state: SettingsState) => state.state);
export const getSettingsError = createSelector(getSettingsState, (state: SettingsState) => state.error);

