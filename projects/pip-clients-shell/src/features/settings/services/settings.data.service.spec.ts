import { HttpClientModule } from '@angular/common/http';
import { async, TestBed, inject } from '@angular/core/testing';
import cloneDeep from 'lodash/cloneDeep';
import { Subscription } from 'rxjs';

import { SettingsDataService } from './settings.data.service';
import { defaultSessionConfig, SESSION_CONFIG } from '../../session/models/SessionConfig';
import { Session, User } from '../../session/models/index';
import { mockSessionProvider, mockSettingsProvider, users, utils, MockSessionService } from '../../../mock/index';
import { SessionService } from '../../session/services/session.service';

describe('[Settings] settings.data.service with errors', () => {
    let service: SettingsDataService;
    let sessionService: MockSessionService;
    let subs: Subscription;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule
            ],
            providers: [
                SettingsDataService,
                mockSessionProvider,
                mockSettingsProvider,
                {
                    provide: SESSION_CONFIG,
                    useValue: defaultSessionConfig
                },
                {
                    provide: SessionService,
                    useClass: MockSessionService
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(inject([SettingsDataService, SessionService],
        (
            settingsDataService: SettingsDataService,
            sessionServiceI: MockSessionService
        ) => {
            service = settingsDataService;
            sessionService = sessionServiceI;
            subs = new Subscription();
        }));

    afterEach(() => {
        subs.unsubscribe();
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should return error on readSettings', done => {
        service.readSettings().subscribe(
            () => { },
            (error) => { expect(error).toEqual(new Error('User not logged in')); done(); }
        );
    });

    it('should return error on readSettings if there\'s no user_id', done => {
        sessionService.init(<Session>{});
        service.readSettings().subscribe(
            () => { },
            (error) => { expect(error).toEqual(new Error('User not logged in')); done(); }
        );
    });

    it('should return error on readSettings if user_id is invalid', done => {
        sessionService.init(<Session>{ user_id: '00000000000000000000000000000011' });
        service.readSettings().subscribe(
            () => { },
            (error) => { expect(error).toBeTruthy(); done(); }
        );
    });

    it('should return error on createSettings', done => {
        service.createSettings({}).subscribe(
            () => { },
            (error) => { expect(error).toEqual(new Error('User not logged in')); done(); }
        );
    });

    it('should return error on createSettings if there\'s no user_id', done => {
        sessionService.init(<Session>{});
        service.createSettings({}).subscribe(
            () => { },
            (error) => { expect(error).toEqual(new Error('User not logged in')); done(); }
        );
    });

    it('should return error on createSettings if user_id is invalid', done => {
        sessionService.init(<Session>{ user_id: '00000000000000000000000000000011' });
        service.createSettings({}).subscribe(
            () => { },
            (error) => { expect(error).toBeTruthy(); done(); }
        );
    });

});

describe('[Settings] settings.data.service', () => {
    let service: SettingsDataService;
    let subs: Subscription;
    let user: User;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule
            ],
            providers: [
                SettingsDataService,
                mockSessionProvider,
                mockSettingsProvider,
                {
                    provide: SESSION_CONFIG,
                    useValue: defaultSessionConfig
                },
                {
                    provide: SessionService,
                    useClass: MockSessionService
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(inject([SettingsDataService, SessionService],
        (
            settingsDataService: SettingsDataService,
            sessionService: MockSessionService
        ) => {
            user = users[0];
            service = settingsDataService;
            sessionService.init(utils.sessions.create(user));
            subs = new Subscription();
        }));

    afterEach(() => {
        subs.unsubscribe();
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should read user settings', done => {
        service.readSettings().subscribe(settings => { expect(settings).toEqual(user.settings); done(); });
    });

    it('should create user settings', done => {
        const userSettings = cloneDeep(user.settings);
        userSettings['key3'] = 'value_3';
        service.createSettings(userSettings).subscribe(settings => { expect(settings).toEqual(userSettings); done(); });
    });

});
