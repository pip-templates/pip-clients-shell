import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Notification } from '../models/index';
import { EntityState } from '../../../common/index';

export interface NotificationsState {
    notifications: Notification[];
    count: number;
    state: EntityState;
    error: any;
}

export const getNotificationsStoreState = createFeatureSelector<NotificationsState>('notifications');

export const getNotificationsData = createSelector(getNotificationsStoreState, (state: NotificationsState) => state.notifications);
export const getNotificationsCount = createSelector(getNotificationsStoreState, (state: NotificationsState) => state.count);
export const getNotificationsState = createSelector(getNotificationsStoreState, (state: NotificationsState) => state.state);
export const getNotificationsError = createSelector(getNotificationsStoreState, (state: NotificationsState) => state.error);
