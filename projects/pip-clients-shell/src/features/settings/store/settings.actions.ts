import { Action } from '@ngrx/store';

export enum SettingsActionType {
    SettingsInit = '[Settings] Init',
    SettingsAbort = '[Settings] Abort',
    SettingsSuccess = '[Settings] Success',
    SettingsFailure = '[Settings] Failure',
    SettingsData = '[Settings] Data',
    SettingsEmpty = '[Settings] Empty',
    SettingsCreate = '[Settings] Create',
    SettingsCreateSuccess = '[Settings] CreateSuccess',
    SettingsCreateFailure = '[Settings] CreateFailure',
    SettingsUpdate = '[Settings] Update',
    SettingsUpdateSuccess = '[Settings] UpdateSuccess',
    SettingsUpdateFailure = '[Settings] UpdateFailure',
    SettingsChangeCancel = '[Settings] ChangeCancel',
}

export class SettingsInitAction implements Action {
    readonly type = SettingsActionType.SettingsInit;

    constructor() { }
}

export class SettingsAbortAction implements Action {
    readonly type = SettingsActionType.SettingsAbort;

    constructor() { }
}

export class SettingsSuccessAction implements Action {
    readonly type = SettingsActionType.SettingsSuccess;

    constructor(public payload: Object) { }
}

export class SettingsFailureAction implements Action {
    readonly type = SettingsActionType.SettingsFailure;

    constructor(public payload: any) { }
}

export class SettingsDataAction implements Action {
    readonly type = SettingsActionType.SettingsData;

    constructor(public payload: Object) { }
}

export class SettingsEmptyAction implements Action {
    readonly type = SettingsActionType.SettingsEmpty;

    constructor() { }
}

export class SettingsCreateAction implements Action {
    readonly type = SettingsActionType.SettingsCreate;

    constructor(public payload: {
        rid?: string,
        settings: Object
    }) { }
}

export class SettingsCreateSuccessAction implements Action {
    readonly type = SettingsActionType.SettingsCreateSuccess;

    constructor(public payload: {
        rid?: string,
        settings: Object
    }) { }
}

export class SettingsCreateFailureAction implements Action {
    readonly type = SettingsActionType.SettingsCreateFailure;

    constructor(public payload: {
        rid?: string,
        error: any
    }) { }
}

export class SettingsUpdateAction implements Action {
    readonly type = SettingsActionType.SettingsUpdate;

    constructor(public payload: {
        rid?: string,
        settings: Object
    }) { }
}

export class SettingsUpdateSuccessAction implements Action {
    readonly type = SettingsActionType.SettingsUpdateSuccess;

    constructor(public payload: {
        rid?: string,
        settings: Object
    }) { }
}

export class SettingsUpdateFailureAction implements Action {
    readonly type = SettingsActionType.SettingsUpdateFailure;

    constructor(public payload: {
        rid?: string,
        error: any
    }) { }
}

export class SettingsChangeCancelAction implements Action {
    readonly type = SettingsActionType.SettingsChangeCancel;

    constructor() { }
}

export type SettingsAction = SettingsInitAction
    | SettingsAbortAction
    | SettingsSuccessAction
    | SettingsFailureAction
    | SettingsDataAction
    | SettingsEmptyAction
    | SettingsCreateAction
    | SettingsCreateSuccessAction
    | SettingsCreateFailureAction
    | SettingsChangeCancelAction
    | SettingsUpdateAction
    | SettingsUpdateSuccessAction
    | SettingsUpdateFailureAction;
