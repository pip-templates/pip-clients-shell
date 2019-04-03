import { Action } from '@ngrx/store';

import { ApplicationTile, ApplicationConfig } from '../models/index';

export enum ApplicationsActionType {
    ApplicationsInit = '[Applications] Init',
    ApplicationsAbort = '[Applications] Abort',
    ApplicationsSuccess = '[Applications] Success',
    ApplicationsFailure = '[Applications] Failure',
    ApplicationsEmpty = '[Applications] Empty',
    ApplicationsData = '[Applications] Data',
    ApplicationsToggleFavourite = '[Applications] ToggleFavourite',
    ApplicationsToggleFavouriteSuccess = '[Applications] ToggleFavouriteSuccess',
    ApplicationsToggleFavouriteFailure = '[Applications] ToggleFavouriteFailure',
}

export class ApplicationsInitAction implements Action {
    readonly type = ApplicationsActionType.ApplicationsInit;

    constructor(public favourites: string[], public config: ApplicationConfig) { }
}

export class ApplicationsAbortAction implements Action {
    readonly type = ApplicationsActionType.ApplicationsAbort;

    constructor() { }
}

export class ApplicationsSuccessAction implements Action {
    readonly type = ApplicationsActionType.ApplicationsSuccess;

    constructor(public payload: ApplicationTile[], public config: ApplicationConfig) { }
}

export class ApplicationsFailureAction implements Action {
    readonly type = ApplicationsActionType.ApplicationsFailure;

    constructor(public payload: any) { }
}

export class ApplicationsEmptyAction implements Action {
    readonly type = ApplicationsActionType.ApplicationsEmpty;

    constructor() { }
}

export class ApplicationsDataAction implements Action {
    readonly type = ApplicationsActionType.ApplicationsData;

    constructor(public payload: ApplicationTile[], public config: ApplicationConfig) { }
}

export class ApplicationsToggleFavouriteAction implements Action {
    readonly type = ApplicationsActionType.ApplicationsToggleFavourite;

    constructor(public payload: {
        rid?: string,
        application_id: string,
        state: boolean,
        config: ApplicationConfig
    }) { }
}

export class ApplicationsToggleFavouriteSuccessAction implements Action {
    readonly type = ApplicationsActionType.ApplicationsToggleFavouriteSuccess;

    constructor() { }
}

export class ApplicationsToggleFavouriteFailureAction implements Action {
    readonly type = ApplicationsActionType.ApplicationsToggleFavouriteFailure;

    constructor(public payload: {
        rid?: string,
        application_id: string,
        error: any,
        state: boolean,
        config: ApplicationConfig
    }) { }
}

export type ApplicationsAction = ApplicationsInitAction
    | ApplicationsAbortAction
    | ApplicationsSuccessAction
    | ApplicationsFailureAction
    | ApplicationsEmptyAction
    | ApplicationsDataAction
    | ApplicationsToggleFavouriteAction
    | ApplicationsToggleFavouriteSuccessAction
    | ApplicationsToggleFavouriteFailureAction;
