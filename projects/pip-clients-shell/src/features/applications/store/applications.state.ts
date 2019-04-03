import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ApplicationTile, ApplicationGroup } from '../models/index';
import { EntityState } from '../../../common/index';

export interface ApplicationsState {
    applications: ApplicationTile[];
    groups: ApplicationGroup[];
    state: EntityState;
    toggling: boolean;
    error: any;
}

export const getApplicationsStoreState = createFeatureSelector<ApplicationsState>('applications');

export const getApplicationsData = createSelector(getApplicationsStoreState, (state: ApplicationsState) => state.applications);
export const getApplicationsGroups = createSelector(getApplicationsStoreState, (state: ApplicationsState) => state.groups);
export const getApplicationsState = createSelector(getApplicationsStoreState, (state: ApplicationsState) => state.state);
export const getApplicationsToggling = createSelector(getApplicationsStoreState, (state: ApplicationsState) => state.toggling);
export const getApplicationsError = createSelector(getApplicationsStoreState, (state: ApplicationsState) => state.error);
