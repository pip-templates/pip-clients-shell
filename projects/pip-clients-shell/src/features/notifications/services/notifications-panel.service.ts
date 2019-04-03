import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Notification, NotificationsPanelState } from '../models/index';
import { ShellService } from '../../shell/services/shell.service';

@Injectable()
export class NotificationsPanelService {

    private _defaultTitle = 'NOTIFICATIONS_PANEL_TITLE';

    private _state$ = new BehaviorSubject<NotificationsPanelState>(NotificationsPanelState.Notifications);
    private _currentNotification$ = new BehaviorSubject<Notification>(null);

    constructor(
        private shell: ShellService
    ) { }

    public setDefaultTitle(): void {
        this.shell.rightnavTitle = this._defaultTitle;
    }

    public goBack() {
        switch (this.state) {
            case NotificationsPanelState.Details:
                this.state = NotificationsPanelState.Notifications;
                break;
        }
    }

    public get state$(): Observable<NotificationsPanelState> {
        return this._state$.asObservable();
    }

    public get state(): NotificationsPanelState {
        return this._state$.getValue();
    }

    public set state(val: NotificationsPanelState) {
        this._state$.next(val);
        switch (val) {
            case NotificationsPanelState.Notifications:
                this.setDefaultTitle();
                this.shell.rightnavShowBack = false;
                break;
            case NotificationsPanelState.Details:
                this.shell.rightnavTitle = this.currentNotification ? this.currentNotification.label : this._defaultTitle;
                this.shell.rightnavShowBack = true;
                break;
        }
    }

    public get currentNotification$(): Observable<Notification> {
        return this._currentNotification$.asObservable();
    }

    public get currentNotification(): Notification {
        return this._currentNotification$.getValue();
    }

    public set currentNotification(notification: Notification) {
        this._currentNotification$.next(notification);
        this.state = notification ? NotificationsPanelState.Details : NotificationsPanelState.Notifications;
    }
}
