import { Action } from '@ngrx/store';

import { Notification } from '../models/index';
import { DataPage } from '../../../common/index';

export enum NotificationsActionType {
    NotificationsInit = '[Notification] Init',
    NotificationsAbort = '[Notification] Abort',
    NotificationsSuccess = '[Notification] Success',
    NotificationsFailure = '[Notification] Failure',
    NotificationsEmpty = '[Notification] Empty',
    NotificationsData = '[Notification] Data',
    NotificationsCountInit = '[Notifications] CountInit',
    NotificationsCountAbort = '[Notifications] CountAbort',
    NotificationsCountSuccess = '[Notifications] CountSuccess',
    NotificationsCountFailure = '[Notifications] CountFailure',
}

export class NotificationsInitAction implements Action {
    readonly type = NotificationsActionType.NotificationsInit;

    constructor() { }
}

export class NotificationsAbortAction implements Action {
    readonly type = NotificationsActionType.NotificationsAbort;

    constructor() { }
}

export class NotificationsSuccessAction implements Action {
    readonly type = NotificationsActionType.NotificationsSuccess;

    constructor(public payload: DataPage<Notification>) { }
}

export class NotificationsFailureAction implements Action {
    readonly type = NotificationsActionType.NotificationsFailure;

    constructor(public payload: any) { }
}

export class NotificationsEmptyAction implements Action {
    readonly type = NotificationsActionType.NotificationsEmpty;

    constructor() { }
}

export class NotificationsDataAction implements Action {
    readonly type = NotificationsActionType.NotificationsData;

    constructor(public payload: DataPage<Notification>) { }
}

export class NotificationsCountInitAction implements Action {
    readonly type = NotificationsActionType.NotificationsCountInit;

    constructor() { }
}

export class NotificationsCountAbortAction implements Action {
    readonly type = NotificationsActionType.NotificationsCountAbort;

    constructor() { }
}

export class NotificationsCountSuccessAction implements Action {
    readonly type = NotificationsActionType.NotificationsCountSuccess;

    constructor(public payload: number) { }
}

export class NotificationsCountFailureAction implements Action {
    readonly type = NotificationsActionType.NotificationsCountFailure;

    constructor(public payload: any) { }
}


export type NotificationsAction = NotificationsInitAction
    | NotificationsAbortAction
    | NotificationsSuccessAction
    | NotificationsFailureAction
    | NotificationsEmptyAction
    | NotificationsDataAction
    | NotificationsCountInitAction
    | NotificationsCountAbortAction
    | NotificationsCountSuccessAction
    | NotificationsCountFailureAction;
