import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, concatMap } from 'rxjs/operators';

import * as fromSettingsActions from './settings.actions';
import { SettingsDataService } from '../services/settings.data.service';

@Injectable()
export class SettingsEffects {
    constructor(
        private actions$: Actions,
        private settingsDataService: SettingsDataService
    ) { }

    @Effect() settingsInit$: Observable<Action> = this.actions$.pipe(
        ofType(
            fromSettingsActions.SettingsActionType.SettingsInit,
            fromSettingsActions.SettingsActionType.SettingsAbort
        ),
        switchMap((action: any) => {
            if (action.type === fromSettingsActions.SettingsActionType.SettingsInit) {
                return this.settingsDataService.readSettings()
                    .pipe(
                        map(data => new fromSettingsActions.SettingsSuccessAction(data)),
                        catchError(error => of(new fromSettingsActions.SettingsFailureAction(error)))
                    );
            } else {
                return of();
            }
        })
    );

    @Effect() settingsSuccess$: Observable<Action | Action[]> = this.actions$.pipe(
        ofType(fromSettingsActions.SettingsActionType.SettingsSuccess),
        map((action: fromSettingsActions.SettingsSuccessAction) => action.payload),
        map((settings: Object) => {
            return Object.keys(settings).length <= 0
                ? new fromSettingsActions.SettingsEmptyAction()
                : new fromSettingsActions.SettingsDataAction(settings);
        })
    );

    @Effect() settingsCreate$: Observable<Action> = this.actions$.pipe(
        ofType(fromSettingsActions.SettingsActionType.SettingsCreate),
        concatMap((action: fromSettingsActions.SettingsCreateAction) => {
            return this.settingsDataService.createSettings(action.payload.settings)
                .pipe(
                    map(data => new fromSettingsActions.SettingsCreateSuccessAction({ rid: action.payload.rid, settings: data })),
                    catchError(error => of(new fromSettingsActions.SettingsCreateFailureAction({ rid: action.payload.rid, error: error })))
                );
        })
    );

    @Effect() settingsUpdate$: Observable<Action> = this.actions$.pipe(
        ofType(fromSettingsActions.SettingsActionType.SettingsUpdate),
        concatMap((action: fromSettingsActions.SettingsUpdateAction) => {
            return this.settingsDataService.createSettings(action.payload.settings)
                .pipe(
                    map(data => new fromSettingsActions.SettingsUpdateSuccessAction({ rid: action.payload.rid, settings: data })),
                    catchError(error => of(new fromSettingsActions.SettingsUpdateFailureAction({ rid: action.payload.rid, error: error })))
                );
        })
    );
}
