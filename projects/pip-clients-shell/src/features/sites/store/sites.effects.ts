import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import findIndex from 'lodash/findIndex';
import { Observable, of, combineLatest } from 'rxjs';
import { catchError, map, switchMap, take, exhaustMap } from 'rxjs/operators';

import * as fromSitesActions from './sites.actions';
import { Site } from '../models/index';
import { SitesDataService } from '../services/sites.data.service';
import { SettingsActionType, SettingsDataAction, SettingsUpdateSuccessAction } from '../../settings/store/index';
import { SettingsService } from '../../settings/services/settings.service';

@Injectable()
export class SitesEffects {
    constructor(
        private actions$: Actions,
        private ds: SitesDataService,
        private settings: SettingsService
    ) { }

    @Effect() sitesInit$: Observable<Action> = this.actions$.pipe(
        ofType(
            fromSitesActions.SitesActionType.SitesInit,
            fromSitesActions.SitesActionType.SitesAbort
        ),
        switchMap((action: any) => {
            if (action.type === fromSitesActions.SitesActionType.SitesInit) {
                return this.ds.readSites()
                    .pipe(
                        map(data => new fromSitesActions.SitesSuccessAction(data.data)),
                        catchError(error => of(new fromSitesActions.SitesFailureAction(error)))
                    );
            } else {
                return of();
            }
        })
    );

    @Effect() sitesSuccess$: Observable<Action | Action[]> = this.actions$.pipe(
        ofType(fromSitesActions.SitesActionType.SitesSuccess),
        map((action: fromSitesActions.SitesSuccessAction) => action.payload),
        map((data: Site[]) => {
            return data.length > 0
                ? new fromSitesActions.SitesDataAction(data)
                : new fromSitesActions.SitesEmptyAction();
        })
    );

    @Effect() sitesCurrent$: Observable<Action> = combineLatest(
        this.actions$.pipe(ofType(fromSitesActions.SitesActionType.SitesData)),
        this.actions$.pipe(ofType(SettingsActionType.SettingsData))
    ).pipe(
        switchMap(([sitesAction, settingsAction]: [fromSitesActions.SitesDataAction, SettingsDataAction]) => {
            const siteId = settingsAction.payload.hasOwnProperty('site_id') ? settingsAction.payload['site_id'] : null;
            const index = Array.isArray(sitesAction.payload) && sitesAction.payload.length
                ? siteId
                    ? findIndex(sitesAction.payload, ['id', siteId])
                    : 0
                : null;
            const site = siteId !== null ? sitesAction.payload[index] : null;
            return site ? of(new fromSitesActions.SitesCurrentAction(site)) : of();
        })
    );

    @Effect() sitesCurrentChangeInit$: Observable<Action> = this.actions$.pipe(
        ofType(
            fromSitesActions.SitesActionType.SitesCurrentChangeInit,
            fromSitesActions.SitesActionType.SitesCurrentChangeAbort,
        ),
        switchMap((action: fromSitesActions.SitesCurrentChangeInitAction | fromSitesActions.SitesCurrentChangeAbortAction) => {
            if (action.type === fromSitesActions.SitesActionType.SitesCurrentChangeInit) {
                this.settings.updateKey('site_id', action.payload.id);
                return of(new fromSitesActions.SitesCurrentChangeSettingsAction(action.payload));
            } else {
                return of();
            }
        })
    );

    @Effect() sitesCurrentChangeSettings$: Observable<Action> = this.actions$.pipe(
        ofType(fromSitesActions.SitesActionType.SitesCurrentChangeSettings),
        exhaustMap((sitesAction: fromSitesActions.SitesCurrentChangeSuccessAction) => this.actions$.pipe(
            ofType(SettingsActionType.SettingsUpdateSuccess),
            take(1),
            map((settingsAction: SettingsUpdateSuccessAction) => {
                const siteId = settingsAction.payload.settings.hasOwnProperty('site_id')
                    ? settingsAction.payload.settings['site_id']
                    : null;
                if (siteId !== sitesAction.payload.id) {
                    return new fromSitesActions.SitesCurrentChangeFailureAction(new Error('Site wasn\'t changed'));
                } else {
                    return new fromSitesActions.SitesCurrentChangeSuccessAction(sitesAction.payload);
                }
            }))
        )
    );

    @Effect() sitesCreateInit$: Observable<Action> = this.actions$.pipe(
        ofType(
            fromSitesActions.SitesActionType.SitesCreateInit,
            fromSitesActions.SitesActionType.SitesCreateFailure,
        ),
        switchMap((action: fromSitesActions.SitesCreateInitAction | fromSitesActions.SitesCreateFailureAction) => {
            if (action.type === fromSitesActions.SitesActionType.SitesCreateInit) {
                return this.ds.createSite(action.payload).pipe(
                    map(site => new fromSitesActions.SitesCreateSuccessAction(site)),
                    catchError(error => of(new fromSitesActions.SitesCreateFailureAction(error)))
                );
            } else {
                return of();
            }
        })
    );

    @Effect() sitesConnectInit$: Observable<Action> = this.actions$.pipe(
        ofType(fromSitesActions.SitesActionType.SitesConnectInit),
        switchMap((action: fromSitesActions.SitesConnectInitAction) => {
            return this.ds.connectToSite(action.payload.id).pipe(
                map(site => new fromSitesActions.SitesConnectSuccessAction(site)),
                catchError(error => of(new fromSitesActions.SitesConnectFailureAction(error)))
            );
        })
    );

    @Effect() sitesDisconnectInit$: Observable<Action> = this.actions$.pipe(
        ofType(fromSitesActions.SitesActionType.SitesDisconnectInit),
        switchMap((action: fromSitesActions.SitesDisconnectInitAction) => {
            return this.ds.disconnectFromSite(action.payload.id).pipe(
                map(site => new fromSitesActions.SitesDisconnectSuccessAction(site)),
                catchError(error => of(new fromSitesActions.SitesDisconnectFailureAction(error)))
            );
        })
    );
}
