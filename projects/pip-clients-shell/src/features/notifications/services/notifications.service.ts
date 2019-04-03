import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Notification } from '../models/index';
import {
    NotificationsState,
    NotificationsInitAction,
    NotificationsCountInitAction,
    getNotificationsData,
    getNotificationsCount,
    getNotificationsState,
    getNotificationsError
} from '../store/index';
import { EntityState } from '../../../common/index';

@Injectable()
export class NotificationsService {

    constructor(
        private store: Store<NotificationsState>,
    ) { }

    public init() {
        this.store.dispatch(new NotificationsCountInitAction());
    }

    public read() {
        this.store.dispatch(new NotificationsInitAction());
    }

    public get notifications$(): Observable<Notification[]> {
        return this.store.select(getNotificationsData);
    }

    public get count$(): Observable<number> {
        return this.store.select(getNotificationsCount);
    }

    public get state$(): Observable<EntityState> {
        return this.store.select(getNotificationsState);
    }

    public get error$(): Observable<any> {
        return this.store.select(getNotificationsError);
    }
}
