import { Action } from '@ngrx/store';

import { Site } from '../models/index';

export enum SitesActionType {
    SitesInit = '[Sites] Init',
    SitesAbort = '[Sites] Abort',
    SitesSuccess = '[Sites] Success',
    SitesFailure = '[Sites] Failure',
    SitesData = '[Sites] Data',
    SitesEmpty = '[Sites] Empty',
    SitesCurrent = '[Sites] Current',
    SitesCurrentChangeInit = '[Sites] CurrentChangeInit',
    SitesCurrentChangeAbort = '[Sites] CurrentChangeAbort',
    SitesCurrentChangeSettings = '[Sites] CurrentChangeSettings',
    SitesCurrentChangeSuccess = '[Sites] CurrentChangeSuccess',
    SitesCurrentChangeFailure = '[Sites] CurrentChangeFailure',
    SitesCreateInit = '[Sites] CreateInit',
    SitesCreateAbort = '[Sites] CreateAbort',
    SitesCreateSuccess = '[Sites] CreateSuccess',
    SitesCreateFailure = '[Sites] CreateFailure',
    SitesConnectInit = '[Sites] ConnectInit',
    SitesConnectSuccess = '[Sites] ConnectSuccess',
    SitesConnectFailure = '[Sites] ConnectFailure',
    SitesDisconnectInit = '[Sites] DisconnectInit',
    SitesDisconnectSuccess = '[Sites] DisconnectSuccess',
    SitesDisconnectFailure = '[Sites] DisconnectFailure',
}

export class SitesInitAction implements Action {
    readonly type = SitesActionType.SitesInit;

    constructor() { }
}

export class SitesAbortAction implements Action {
    readonly type = SitesActionType.SitesAbort;

    constructor() { }
}

export class SitesSuccessAction implements Action {
    readonly type = SitesActionType.SitesSuccess;

    constructor(public payload: Site[]) { }
}

export class SitesFailureAction implements Action {
    readonly type = SitesActionType.SitesFailure;

    constructor(public payload: any) { }
}

export class SitesDataAction implements Action {
    readonly type = SitesActionType.SitesData;

    constructor(public payload: Site[]) { }
}

export class SitesEmptyAction implements Action {
    readonly type = SitesActionType.SitesEmpty;

    constructor() { }
}

export class SitesCurrentAction implements Action {
    readonly type = SitesActionType.SitesCurrent;

    constructor(public payload: Site) { }
}

export class SitesCurrentChangeInitAction implements Action {
    readonly type = SitesActionType.SitesCurrentChangeInit;

    constructor(public payload: Site) { }
}

export class SitesCurrentChangeAbortAction implements Action {
    readonly type = SitesActionType.SitesCurrentChangeAbort;

    constructor() { }
}

export class SitesCurrentChangeSettingsAction implements Action {
    readonly type = SitesActionType.SitesCurrentChangeSettings;

    constructor(public payload: Site) { }
}

export class SitesCurrentChangeSuccessAction implements Action {
    readonly type = SitesActionType.SitesCurrentChangeSuccess;

    constructor(public payload: Site) { }
}

export class SitesCurrentChangeFailureAction implements Action {
    readonly type = SitesActionType.SitesCurrentChangeFailure;

    constructor(public payload: any) { }
}

export class SitesCreateInitAction implements Action {
    readonly type = SitesActionType.SitesCreateInit;

    constructor(public payload: Site) {}
}

export class SitesCreateAbortAction implements Action {
    readonly type = SitesActionType.SitesCreateAbort;

    constructor() {}
}

export class SitesCreateSuccessAction implements Action {
    readonly type = SitesActionType.SitesCreateSuccess;

    constructor(public payload: Site) {}
}

export class SitesCreateFailureAction implements Action {
    readonly type = SitesActionType.SitesCreateFailure;

    constructor(public payload: any) {}
}

export class SitesConnectInitAction implements Action {
    readonly type = SitesActionType.SitesConnectInit;

    constructor(public payload: Site) { }
}

export class SitesConnectSuccessAction implements Action {
    readonly type = SitesActionType.SitesConnectSuccess;

    constructor(public payload: Site) { }
}

export class SitesConnectFailureAction implements Action {
    readonly type = SitesActionType.SitesConnectFailure;

    constructor(public payload: any) { }
}

export class SitesDisconnectInitAction implements Action {
    readonly type = SitesActionType.SitesDisconnectInit;

    constructor(public payload: Site) { }
}

export class SitesDisconnectSuccessAction implements Action {
    readonly type = SitesActionType.SitesDisconnectSuccess;

    constructor(public payload: Site) { }
}

export class SitesDisconnectFailureAction implements Action {
    readonly type = SitesActionType.SitesDisconnectFailure;

    constructor(public payload: any) { }
}



export type SitesAction = SitesInitAction
    | SitesAbortAction
    | SitesSuccessAction
    | SitesFailureAction
    | SitesDataAction
    | SitesEmptyAction
    | SitesCurrentAction
    | SitesCurrentChangeInitAction
    | SitesCurrentChangeAbortAction
    | SitesCurrentChangeSettingsAction
    | SitesCurrentChangeSuccessAction
    | SitesCurrentChangeFailureAction
    | SitesCreateInitAction
    | SitesCreateAbortAction
    | SitesCreateSuccessAction
    | SitesCreateFailureAction
    | SitesConnectInitAction
    | SitesConnectSuccessAction
    | SitesConnectFailureAction
    | SitesDisconnectInitAction
    | SitesDisconnectSuccessAction
    | SitesDisconnectFailureAction;
