import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { LocalStorageModule, LocalStorageService } from 'angular-2-local-storage';
import { hot, cold } from 'jasmine-marbles';
import cloneDeep from 'lodash/cloneDeep';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Observable } from 'rxjs';

import * as fromSessionActions from './session.actions';
import { SessionEffects } from './session.effects';
import { Session, SessionConfig, SESSION_CONFIG, defaultSessionConfig, User } from '../models/index';
import { users, utils, mockSessionProvider, MockSessionService } from '../../../mock/index';
import { SessionAuthInterceptorProvider } from '../http-interceptors/auth.interceptor';
import { SessionDataService } from '../services/session.data.service';
import { SessionService } from '../services/session.service';
import { WINDOW } from '../../../common/services/window.service';

describe('[Session] store/effects', () => {

    let sessionService: MockSessionService;
    let actions: Observable<any>;
    let effects: SessionEffects;
    let user: User;
    let session: Session;
    let subs: Subscription;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                LocalStorageModule.withConfig({
                    prefix: 'pip-clients',
                    storageType: 'localStorage'
                }),
            ],
            providers: [
                SessionEffects,
                provideMockActions(() => actions),
                SessionDataService,
                SessionAuthInterceptorProvider,
                mockSessionProvider,
                {
                    provide: SessionService,
                    useClass: MockSessionService
                },
                {
                    provide: SESSION_CONFIG,
                    useValue: defaultSessionConfig
                },
                {
                    provide: WINDOW,
                    useValue: {
                        location: {
                            origin: '',
                            href: ''
                        }
                    },
                }
            ],
        });
        user = users[0];
        session = utils.sessions.create(user);
        effects = TestBed.get(SessionEffects);
        sessionService = TestBed.get(SessionService);
        subs = new Subscription();
    });

    afterEach(() => { subs.unsubscribe(); });

    // it('SessionSigninInit$', () => {
    //     const action = new fromSessionActions.SessionSigninInitAction(user.login, user.password);
    //     const completion = new fromSessionActions.SessionSigninSuccessAction(session);

    //     // Refer to 'Writing Marble Tests' for details on '--a-' syntax
    //     actions = hot('a|', { a: action });
    //     const expected = cold('-(b|)', { b: completion });

    //     expect(effects.SessionSigninInit$).toBeObservable(expected);
    // });

    it('SessionSigninInit$ success', done => {
        actions = new BehaviorSubject(new fromSessionActions.SessionSigninInitAction(user.login, user.password));

        subs.add(effects.SessionSigninInit$.subscribe(res => {
            expect(res.type).toEqual(fromSessionActions.SessionActionType.SessionSigninSuccess);
            done();
        }));
    });

    it('SessionSigninInit$ failure', done => {
        actions = new BehaviorSubject(new fromSessionActions.SessionSigninInitAction('bad login', user.password));

        subs.add(effects.SessionSigninInit$.subscribe(res => {
            expect(res.type).toEqual(fromSessionActions.SessionActionType.SessionSigninFailure);
            done();
        }));
    });

    it('SessionSignoutInit$ success', done => {
        const s = utils.sessions.create(user);
        sessionService.init(s);
        actions = new BehaviorSubject(new fromSessionActions.SessionSignoutInitAction());

        subs.add(effects.SessionSignoutInit$.subscribe(res => {
            expect(res.type).toEqual(fromSessionActions.SessionActionType.SessionSignoutSuccess);
            done();
        }));
    });

    it('SessionSignoutInit$ failure', done => {
        actions = new BehaviorSubject(new fromSessionActions.SessionSignoutInitAction());

        subs.add(effects.SessionSignoutInit$.subscribe(res => {
            expect(res.type).toEqual(fromSessionActions.SessionActionType.SessionSignoutFailure);
            done();
        }));
    });

    it('SessionRestoreInit$ success', done => {
        sessionService.init(session);
        actions = new BehaviorSubject(new fromSessionActions.SessionRestoreInitAction(session));

        subs.add(effects.SessionRestoreInit$.subscribe(res => {
            expect(res.type).toEqual(fromSessionActions.SessionActionType.SessionRestoreSuccess);
            done();
        }));
    });

    it('SessionRestoreInit$ failure', done => {
        const badSession = cloneDeep(session);
        badSession.id = '11000000000000000000000000000000';
        actions = new BehaviorSubject(new fromSessionActions.SessionRestoreInitAction(badSession));

        subs.add(effects.SessionRestoreInit$.subscribe(res => {
            expect(res.type).toEqual(fromSessionActions.SessionActionType.SessionRestoreFailure);
            done();
        }));
    });

    it('SessionSaveSession$ signin success', done => {
        actions = new BehaviorSubject(new fromSessionActions.SessionSigninSuccessAction(session));

        subs.add(effects.SessionSaveSession$.subscribe(() => {
            const lss: LocalStorageService = TestBed.get(LocalStorageService);
            const lsSession: Session = lss.get('session');
            if (lsSession && lsSession.user && lsSession.user.create_time) {
                lsSession.user.create_time = new Date(lsSession.user.create_time);
            }
            if (lsSession && lsSession.request_time) { lsSession.request_time = new Date(lsSession.request_time); }
            if (lsSession && lsSession.open_time) { lsSession.open_time = new Date(lsSession.open_time); }
            expect(lsSession).toEqual(session);
            done();
        }));
    });

    it('SessionSaveSession$ restore success', done => {
        actions = new BehaviorSubject(new fromSessionActions.SessionRestoreSuccessAction(session));

        subs.add(effects.SessionSaveSession$.subscribe(() => {
            const lss: LocalStorageService = TestBed.get(LocalStorageService);
            const lsSession: Session = lss.get('session');
            if (lsSession && lsSession.user && lsSession.user.create_time) {
                lsSession.user.create_time = new Date(lsSession.user.create_time);
            }
            if (lsSession && lsSession.request_time) { lsSession.request_time = new Date(lsSession.request_time); }
            if (lsSession && lsSession.open_time) { lsSession.open_time = new Date(lsSession.open_time); }
            expect(lsSession).toEqual(session);
            done();
        }));
    });

    it('SessionCloseSession$ signout success', done => {
        const lss: LocalStorageService = TestBed.get(LocalStorageService);
        lss.set('session', session);
        actions = new BehaviorSubject(new fromSessionActions.SessionSignoutSuccessAction());

        subs.add(effects.SessionCloseSession$.subscribe(() => {
            const lsSession: Session = lss.get('session');
            expect(lsSession).toEqual(null);
            done();
        }));
    });

    it('SessionCloseSession$ restore failure', done => {
        const lss: LocalStorageService = TestBed.get(LocalStorageService);
        lss.set('session', session);
        actions = new BehaviorSubject(new fromSessionActions.SessionRestoreFailureAction('error'));

        subs.add(effects.SessionCloseSession$.subscribe(() => {
            expect(lss.get<Session>('session')).toEqual(null);
            done();
        }));
    });

    it('SessionToAuthorizedUrl$', done => {
        const config: SessionConfig = TestBed.get(SESSION_CONFIG);
        const w = TestBed.get(WINDOW);
        actions = new BehaviorSubject(new fromSessionActions.SessionSigninSuccessAction(session));

        subs.add(effects.SessionToAuthorizedUrl$.subscribe(() => {
            expect(w.location.href).toEqual(w.location.origin + config.autorizedUrl);
            done();
        }));
    });

    it('SessionToUnauthorizedUrl$ signout success', done => {
        const config: SessionConfig = TestBed.get(SESSION_CONFIG);
        const w = TestBed.get(WINDOW);
        actions = new BehaviorSubject(new fromSessionActions.SessionSignoutSuccessAction());

        subs.add(effects.SessionToUnauthorizedUrl$.subscribe(() => {
            expect(w.location.href).toEqual(w.location.origin + config.unautorizedUrl);
            done();
        }));
    });

    it('SessionToUnauthorizedUrl$ restore failure', done => {
        const config: SessionConfig = TestBed.get(SESSION_CONFIG);
        const w = TestBed.get(WINDOW);
        actions = new BehaviorSubject(new fromSessionActions.SessionRestoreFailureAction('error'));

        subs.add(effects.SessionToUnauthorizedUrl$.subscribe(() => {
            expect(w.location.href).toEqual(w.location.origin + config.unautorizedUrl);
            done();
        }));
    });

});
