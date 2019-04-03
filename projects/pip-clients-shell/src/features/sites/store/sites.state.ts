import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Site } from '../models/index';
import { EntityState } from '../../../common/index';

export interface SitesState {
    sites: Site[];
    current: Site;
    state: EntityState;
    error: any;
}

export const getSitesStoreState = createFeatureSelector<SitesState>('sites');

export const getSitesSites = createSelector(getSitesStoreState, (state: SitesState) => state.sites);
export const getSitesCurrent = createSelector(getSitesStoreState, (state: SitesState) => state.current);
export const getSitesState = createSelector(getSitesStoreState, (state: SitesState) => state.state);
export const getSitesError = createSelector(getSitesStoreState, (state: SitesState) => state.error);
