import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import { Observable } from 'rxjs';
import { first, filter, debounceTime, map, distinct } from 'rxjs/operators';

import {
    SettingsInitAction,
    SettingsCreateAction,
    SettingsUpdateAction,
    SettingsState,
    getSettingsData,
    getSettingsEntityState,
    getSettingsError
} from '../store/index';
import { EntityState } from '../../../common/index';

@Injectable()
export class SettingsService {

    private state: EntityState;

    constructor(
        private store: Store<SettingsState>
    ) {
        this.state$.subscribe(state => {
            this.state = state;
        });
    }

    public init(): void {
        if (!this.state || this.state === EntityState.Empty || this.state === EntityState.Error) {
            this.store.dispatch(new SettingsInitAction());
        }
    }

    public read(): void {
        this.store.dispatch(new SettingsInitAction());
    }

    public get settings$(): Observable<Object> {
        return this.store.select(getSettingsData);
    }

    public get state$(): Observable<EntityState> {
        return this.store.select(getSettingsEntityState);
    }

    public get error$(): Observable<any> {
        return this.store.select(getSettingsError);
    }

    public createSettings(settings: Object): void {
        this.store.dispatch(new SettingsCreateAction({ settings }));
    }

    public getSetting$(key: string): Observable<any> {
        return this.settings$.pipe(
            filter(s => s && Object.keys(s).length > 0),
            map(s => s[key])
        );
    }

    public updateSettings(settings: Object, isMerge: boolean = false, rid?: string): void {
        if (!this.state || this.state === EntityState.Empty) { return; }
        if (isMerge) {
            this.settings$.pipe(first()).subscribe(data => {
                this.store.dispatch(new SettingsUpdateAction({ rid, settings: merge({}, cloneDeep(data), settings) }));
            });
        } else {
            this.store.dispatch(new SettingsUpdateAction({ rid, settings }));
        }
    }

    public updateKey(key: string, value: string, rid?: string): void {
        if (!this.state || this.state === EntityState.Empty) { return; }
        this.settings$.pipe(
            filter(settings => !!settings),
            first()
        ).subscribe(settings => {
            const newSettings = cloneDeep(settings);
            newSettings[key] = value;
            this.store.dispatch(new SettingsUpdateAction({ rid, settings: newSettings }));
        });
    }

    public deleteKey(key: string | string[], rid?: string): void {
        if (!this.state || this.state === EntityState.Empty) { return; }
        this.settings$.pipe(
            filter(settings => !!settings),
            first()
        ).subscribe(settings => {
            let keys = key;
            const newSettings = cloneDeep(settings);
            if (!Array.isArray(keys)) { keys = [keys]; }
            for (const k of keys) {
                if (newSettings.hasOwnProperty(k)) {
                    delete newSettings[k];
                }
            }
            this.store.dispatch(new SettingsUpdateAction({ rid, settings: newSettings }));
        });
    }
}
