import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Session } from '../models/index';
import { EntityState } from '../../../common/index';

export interface SessionState {
    session: Session;
    state: EntityState;
    error: any;
}

export const getSessionStoreState = createFeatureSelector<SessionState>('auth');

export const getSessionSession = createSelector(getSessionStoreState, (state: SessionState) => state.session);
export const getSessionState = createSelector(getSessionStoreState, (state: SessionState) => state.state);
export const getSessionError = createSelector(getSessionStoreState, (state: SessionState) => state.error);
