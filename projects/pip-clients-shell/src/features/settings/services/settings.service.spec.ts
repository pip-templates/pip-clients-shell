import { async, TestBed, inject, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { StoreModule, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LocalStorageModule } from 'angular-2-local-storage';
import cloneDeep from 'lodash/cloneDeep';
import sample from 'lodash/sample';
import { Subscription, Observable, of } from 'rxjs';
import { filter, last, take } from 'rxjs/operators';

import { SettingsService } from './settings.service';
import { SettingsDataService } from './settings.data.service';
import { settingsReducer } from '../store/settings.reducer';
import {
    SettingsEffects,
    SettingsState,
    SettingsInitAction,
    SettingsFailureAction,
    SettingsCreateFailureAction,
    SettingsUpdateFailureAction,
} from '../store/index';
import { defaultSessionConfig, SESSION_CONFIG, User } from '../../session/models/index';
import { mockSessionProvider, mockSettingsProvider, users } from '../../../mock/index';
import { EntityState } from '../../../common/index';

class MockSettingsDataService {

    private _settings: Object;

    public init(settings: Object) {
        this._settings = settings;
    }

    public readSettings(): Observable<Object> {
        return of(this._settings);
    }

    public createSettings(settings: Object): Observable<any> {
        this._settings = settings;
        return of(this._settings);
    }
}

describe('[Settings] settings.service', () => {
    let store: Store<SettingsState>;
    let service: SettingsService;
    let subs: Subscription;
    let user: User;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                LocalStorageModule.withConfig({
                    prefix: 'pip-clients',
                    storageType: 'localStorage'
                }),
                RouterModule.forRoot([]),
                StoreModule.forRoot({}),
                EffectsModule.forRoot([]),
                StoreModule.forFeature('settings', settingsReducer),
                EffectsModule.forFeature([SettingsEffects]),
            ],
            providers: [
                SettingsService,
                {
                    provide: SettingsDataService,
                    useClass: MockSettingsDataService
                },
                mockSessionProvider,
                mockSettingsProvider,
                {
                    provide: SESSION_CONFIG,
                    useValue: defaultSessionConfig
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(inject([Store, SettingsService, SettingsDataService],
        (
            testStore: Store<SettingsState>,
            settingsService: SettingsService,
            settingsDataService: MockSettingsDataService
        ) => {
            user = users[0];
            store = testStore;
            service = settingsService;
            settingsDataService.init(user.settings);
            subs = new Subscription();
            if (user.settings.hasOwnProperty('key3')) { delete user.settings['key3']; }
        }));

    afterEach(() => {
        subs.unsubscribe();
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should init settings$', done => {
        service.init();
        subs.add(service.settings$.pipe(
            filter(settings => Object.keys(settings).length > 0),
        ).subscribe(settings => {
            expect(settings).toEqual(user.settings);
            done();
        }));
    });

    it('should init if state was \'Error\'', fakeAsync(() => {
        const dispatchSpy = spyOn(store, 'dispatch');
        const latestError = new Error('SettingsFailureAction');
        store.dispatch(new SettingsFailureAction(latestError));
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(
            new SettingsFailureAction(latestError)
        );
        service.error$.pipe(
            filter(error => error),
            last()
        ).subscribe(error => expect(error).toEqual(latestError));
        service.state$.pipe(
            filter(state => state !== EntityState.Empty),
            last()
        ).subscribe(state => expect(state).toEqual(EntityState.Error));
        service.init();
        tick(100);
        expect(dispatchSpy).toHaveBeenCalledTimes(2);
        expect(dispatchSpy).toHaveBeenCalledWith(
            new SettingsInitAction()
        );
    }));

    it('should read settings$', () => {
        service.init();
        const dispatchSpy = spyOn(store, 'dispatch');
        service.read();
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(
            new SettingsInitAction()
        );
    });

    it('should read setting by key', done => {
        service.init();
        const key = sample(Object.keys(user.settings));
        if (key) {
            subs.add(service.getSetting$(key).subscribe(val => {
                expect(val).toEqual(user.settings[key]);
                done();
            }));
        }
    });

    it('should return and change error$', () => {
        let latestError: any = null;
        subs.add(service.error$.pipe(filter(error => !!error)).subscribe((error) => expect(error).toEqual(latestError)));
        subs.add(service.state$.pipe(filter(() => latestError !== null)).subscribe(state => expect(state).toEqual(EntityState.Error)));
        latestError = new Error('SettingsFailureAction');
        store.dispatch(new SettingsFailureAction(latestError));
        latestError = new Error('SettingsCreateFailureAction');
        store.dispatch(new SettingsCreateFailureAction(latestError));
        latestError = new Error('SettingsUpdateFailureAction');
        store.dispatch(new SettingsUpdateFailureAction(latestError));
    });

    it('should create settings', () => {
        service.init();
        const latestSettings = {
            'test_prop_1': 'test_value_1',
            'test_prop_2': 'test_value_2',
        };
        service.createSettings(latestSettings);
        subs.add(service.settings$.subscribe((settings) => {
            expect(settings).toEqual(latestSettings);
        }));
    });

    it('should update settings', fakeAsync(() => {
        service.init();
        tick(100);
        let latestSettings: Object = cloneDeep(user.settings);
        let gotSettings: Object;
        latestSettings['test_prop_1'] = 'test_value_1';
        service.updateSettings({ 'test_prop_1': 'test_value_1' }, true);
        service.settings$.pipe(take(1)).subscribe(s => gotSettings = s);
        expect(gotSettings).toEqual(latestSettings);
        latestSettings['test_prop_2'] = 'test_value_2';
        service.updateSettings({ 'test_prop_2': 'test_value_2' }, true);
        service.settings$.pipe(take(1)).subscribe(s => gotSettings = s);
        expect(gotSettings).toEqual(latestSettings);
        latestSettings = { 'test_prop_2': 'test_value_2' };
        service.updateSettings(latestSettings);
        service.settings$.pipe(take(1)).subscribe(s => gotSettings = s);
        expect(gotSettings).toEqual(latestSettings);
        discardPeriodicTasks();
    }));

    it('should update settings key', done => {
        let latestSettings: Object = null;
        const userSettings = cloneDeep(user.settings);
        service.updateKey('key1', 'updated value');
        service.settings$.pipe(last()).subscribe(s => latestSettings = s);
        expect(latestSettings).toEqual(null);
        service.init();
        subs.add(service.state$.pipe(filter(state => state === EntityState.Data), take(1)).subscribe(state => {
            userSettings['key1'] = 'updated value';
            service.updateKey('key1', 'updated value');
            subs.add(service.settings$.pipe(
                filter(s => s.hasOwnProperty('key1') && s['key1'] === 'updated value'),
                take(1)
            ).subscribe(s => {
                expect(s).toEqual(userSettings);
                done();
            }));
        }));
    });

    it('should delete settings key', done => {
        let latestSettings: Object = null;
        const userSettings = cloneDeep(user.settings);
        service.deleteKey('key1');
        service.settings$.pipe(last()).subscribe(s => latestSettings = s);
        expect(latestSettings).toEqual(null);
        service.init();
        subs.add(service.state$.pipe(filter(state => state === EntityState.Data), take(1)).subscribe(state => {
            delete userSettings['key1'];
            service.deleteKey('key1');
            subs.add(service.settings$.pipe(
                filter(s => !s.hasOwnProperty('key1')),
                take(1)
            ).subscribe(s => {
                expect(s).toEqual(userSettings);
                done();
            }));
        }));
    });

    it('should delete settings keys', done => {
        let latestSettings: Object = null;
        const userSettings = cloneDeep(user.settings);
        service.deleteKey('key1');
        service.settings$.pipe(last()).subscribe(s => latestSettings = s);
        expect(latestSettings).toEqual(null);
        service.init();
        subs.add(service.state$.pipe(filter(state => state === EntityState.Data), take(1)).subscribe(state => {
            delete userSettings['key1'];
            service.deleteKey(['key1', 'key3']);
            subs.add(service.settings$.pipe(
                filter(s => !s.hasOwnProperty('key1')),
                take(1)
            ).subscribe(s => {
                expect(s).toEqual(userSettings);
                done();
            }));
        }));
    });

});
