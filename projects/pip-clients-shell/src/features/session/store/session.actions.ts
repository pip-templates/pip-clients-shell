import { Action } from '@ngrx/store';

import { Session } from '../models/index';

export enum SessionActionType {
    SessionSigninInit = '[Session] SigninInit',
    SessionSigninAbort = '[Session] SigninAbort',
    SessionSigninSuccess = '[Session] SigninSuccess',
    SessionSigninFailure = '[Session] SigninFailure',
    SessionSignoutInit = '[Session] SignoutInit',
    SessionSignoutAbort = '[Session] SignoutAbort',
    SessionSignoutSuccess = '[Session] SignoutSuccess',
    SessionSignoutFailure = '[Session] SignoutFailure',
    SessionRestoreInit = '[Session] RestoreInit',
    SessionRestoreSuccess = '[Session] RestoreSuccess',
    SessionRestoreFailure = '[Session] RestoreFailure',
    SessionCloseAllInit = '[Session] CloseAllInit',
    SessionCloseAllSuccess = '[Session] CloseAllSuccess',
    SessionCloseAllFailure = '[Session] CloseAllFailure',
}

export class SessionSigninInitAction implements Action {
    readonly type = SessionActionType.SessionSigninInit;

    constructor(public login: string, public password: string) { }
}

export class SessionSigninAbortAction implements Action {
    readonly type = SessionActionType.SessionSigninAbort;

    constructor() { }
}

export class SessionSigninSuccessAction implements Action {
    readonly type = SessionActionType.SessionSigninSuccess;

    constructor(public payload: Session) { }
}

export class SessionSigninFailureAction implements Action {
    readonly type = SessionActionType.SessionSigninFailure;

    constructor(public payload: any) { }
}

export class SessionSignoutInitAction implements Action {
    readonly type = SessionActionType.SessionSignoutInit;

    constructor() { }
}

export class SessionSignoutAbortAction implements Action {
    readonly type = SessionActionType.SessionSignoutAbort;

    constructor() { }
}

export class SessionSignoutSuccessAction implements Action {
    readonly type = SessionActionType.SessionSignoutSuccess;

    constructor() { }
}

export class SessionSignoutFailureAction implements Action {
    readonly type = SessionActionType.SessionSignoutFailure;

    constructor(public payload: any) { }
}

export class SessionRestoreInitAction implements Action {
    readonly type = SessionActionType.SessionRestoreInit;

    constructor(public payload: Session) { }
}

export class SessionRestoreSuccessAction implements Action {
    readonly type = SessionActionType.SessionRestoreSuccess;

    constructor(public payload: Session) { }
}

export class SessionRestoreFailureAction implements Action {
    readonly type = SessionActionType.SessionRestoreFailure;

    constructor(public payload: any) { }
}

export class SessionCloseAllInitAction implements Action {
    readonly type = SessionActionType.SessionCloseAllInit;

    constructor() { }
}

export class SessionCloseAllSuccessAction implements Action {
    readonly type = SessionActionType.SessionCloseAllSuccess;

    constructor() { }
}

export class SessionCloseAllFailureAction implements Action {
    readonly type = SessionActionType.SessionCloseAllFailure;

    constructor(public payload: any) { }
}


export type SessionAction = SessionSigninInitAction
    | SessionSigninAbortAction
    | SessionSigninSuccessAction
    | SessionSigninFailureAction
    | SessionSignoutInitAction
    | SessionSignoutAbortAction
    | SessionSignoutSuccessAction
    | SessionSignoutFailureAction
    | SessionRestoreInitAction
    | SessionRestoreSuccessAction
    | SessionRestoreFailureAction
    | SessionCloseAllInitAction
    | SessionCloseAllSuccessAction
    | SessionCloseAllFailureAction;
