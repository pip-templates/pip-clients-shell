import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import { Observable } from 'rxjs';
import { withLatestFrom, map, filter, first, distinctUntilKeyChanged } from 'rxjs/operators';

import {
    ApplicationsInitAction,
    getApplicationsData,
    getApplicationsGroups,
    getApplicationsState,
    getApplicationsToggling,
    getApplicationsError,
    ApplicationsToggleFavouriteAction
} from '../store/index';
import { ApplicationTile, ApplicationGroup } from '../models/index';
import { ApplicationsConfigService } from './applications.config.service';
import { SettingsService } from '../../settings/services/settings.service';
import { SitesService } from '../../sites/services/sites.service';
import { Site } from '../../sites/index';
import { EntityState, generateUUID } from '../../../common/index';

@Injectable()
export class ApplicationsService {

    static appUpdateSub = null;

    constructor(
        private applicationsConfig: ApplicationsConfigService,
        private store: Store<any>,
        private settingsService: SettingsService,
        private sitesService: SitesService
    ) { }

    public init(): void {
        if (ApplicationsService.appUpdateSub) { return; }
        this.settingsService.init();
        this.sitesService.init();
        ApplicationsService.appUpdateSub = this.sitesService.current$.pipe(
            filter(site => site !== null),
            distinctUntilKeyChanged('id'),
            withLatestFrom(this.settingsService.settings$),
            // first()
        ).subscribe(([site, settings]: [Site, Object]) => {
            const key = this.applicationsConfig.favouritesGroupName += '_' + site.id;
            const favourites = settings.hasOwnProperty(key) ? JSON.parse(settings[key]) : [];
            this.store.dispatch(new ApplicationsInitAction(favourites, this.applicationsConfig.config));
        });
    }

    public get applications$(): Observable<ApplicationTile[]> {
        return this.store.select(getApplicationsData);
    }

    public get groups$(): Observable<ApplicationGroup[]> {
        return this.store.select(getApplicationsGroups);
    }

    public get favourites$(): Observable<ApplicationTile[]> {
        return this.store.select(getApplicationsGroups).pipe(
            filter((groups: ApplicationGroup[]) => Array.isArray(groups) && groups.length > 0),
            map((groups: ApplicationGroup[]) => {
                const index = findIndex(groups, ['name', this.applicationsConfig.favouritesGroupName]);
                return index >= 0 ? groups[index].applications : [];
            })
        );
    }

    public get state$(): Observable<EntityState> {
        return this.store.select(getApplicationsState);
    }

    public get toggling$(): Observable<boolean> {
        return this.store.select(getApplicationsToggling);
    }

    public get error$(): Observable<any> {
        return this.store.select(getApplicationsError);
    }

    public toggleFavourite(app: ApplicationTile, state?: boolean) {
        this.sitesService.current$.pipe(
            filter(site => site !== null),
            withLatestFrom(this.settingsService.settings$, this.applications$),
            first()
        ).subscribe(([site, settings, apps]: [Site, Object, ApplicationTile[]]) => {
            const found = apps.find(a => a.id === app.id);
            if (found) {
                const newState = typeof state === 'undefined' ? !app.isFavourite : state;
                const key = this.applicationsConfig.favouritesGroupName + '_' + site.id;
                const favourites = cloneDeep(settings.hasOwnProperty(key) ? <string[]>JSON.parse(settings[key]) : []);
                const inFavouritesIdx = favourites.indexOf(app.id), inFavourites = inFavouritesIdx >= 0;
                if (inFavourites !== newState) {
                    if (inFavourites) {
                        // remove from favourites
                        favourites.splice(inFavouritesIdx, 1);
                    } else {
                        // add into favourites
                        favourites.push(app.id);
                    }
                    const rid = generateUUID();
                    this.store.dispatch(new ApplicationsToggleFavouriteAction({
                        rid,
                        application_id: found.id,
                        state: newState,
                        config: this.applicationsConfig.config
                    }));
                    this.settingsService.updateKey(key, JSON.stringify(favourites), rid);
                }
            }
        });
    }
}
