import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import {
    SitesState,
    SitesInitAction,
    SitesConnectInitAction,
    SitesCreateInitAction,
    SitesCurrentChangeInitAction,
    SitesDisconnectInitAction,
    getSitesSites,
    getSitesCurrent,
    getSitesState,
    getSitesError
} from '../store/index';
import { Site } from '../models/index';
import { EntityState } from '../../../common/index';
import { SettingsService } from '../../settings/services/settings.service';

@Injectable()
export class SitesService {

    constructor(
        private store: Store<SitesState>,
        private settingsService: SettingsService
    ) { }

    public init(): void {
        this.settingsService.init();
        this.state$.pipe(
            first()
        ).subscribe(state => {
            if (state === EntityState.Empty || state === EntityState.Error) {
                this.store.dispatch(new SitesInitAction());
            }
        });
    }

    public read(): void {
        return this.store.dispatch(new SitesInitAction());
    }

    public get sites$(): Observable<Site[]> {
        return this.store.select(getSitesSites);
    }

    public get current$(): Observable<Site> {
        return this.store.select(getSitesCurrent);
    }

    public set current(site: Site) {
        this.store.dispatch(new SitesCurrentChangeInitAction(site));
    }

    public get state$(): Observable<EntityState> {
        return this.store.select(getSitesState);
    }

    public get error$(): Observable<any> {
        return this.store.select(getSitesError);
    }

    public createSite(site: Site): void {
        return this.store.dispatch(new SitesCreateInitAction(site));
    }

    public connectToSite(site: Site): void {
        return this.store.dispatch(new SitesConnectInitAction(site));
    }

    public disconnectFromSite(site: Site): void {
        return this.store.dispatch(new SitesDisconnectInitAction(site));
    }
}
