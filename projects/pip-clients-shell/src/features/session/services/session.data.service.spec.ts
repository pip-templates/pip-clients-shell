import { HttpClientModule } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';
import cloneDeep from 'lodash/cloneDeep';
import { Subscription } from 'rxjs';

import { SessionService } from './session.service';
import { SessionDataService } from './session.data.service';
import { SessionAuthInterceptorProvider } from '../http-interceptors/auth.interceptor';
import { Session, SESSION_CONFIG, defaultSessionConfig, SignupUser, User } from '../models/index';
import { users, utils, mockSessionProvider, MockSessionService } from '../../../mock/index';

describe('[Session] session.data.service', () => {

    let service: SessionDataService;
    let sessionService: MockSessionService;
    let subs: Subscription;
    let user: User;
    let session: Session;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule
            ],
            providers: [
                SessionAuthInterceptorProvider,
                SessionDataService,
                mockSessionProvider,
                {
                    provide: SessionService,
                    useClass: MockSessionService
                },
                {
                    provide: SESSION_CONFIG,
                    useValue: defaultSessionConfig
                },
            ],
        })
            .compileComponents();
    });

    beforeEach(inject([SessionService, SessionDataService],
        (
            sessionsService: MockSessionService,
            sessionDataService: SessionDataService,
        ) => {
            localStorage.clear();
            service = sessionDataService;
            sessionService = sessionsService;
            subs = new Subscription();
            user = users[0];
            session = utils.sessions.create(user);
        }));

    afterEach(() => {
        subs.unsubscribe();
    });

    afterAll(() => {
        localStorage.clear();
    });

    it('should signin', done => {
        subs.add(service.signin(user.login, user.password).subscribe(s => {
            expect(s).toBeTruthy();
            expect(s.user_id).toEqual(user.id);
            done();
        }));
    });

    it('shouldn\'t signin with bad data', done => {
        let count = 2;
        const subDone = () => {
            count--;
            if (!count) { done(); }
        };
        subs.add(service.signin('bad login', user.password).subscribe(
            () => { },
            (error) => { expect(error.code).toEqual('WRONG_LOGIN'); subDone(); }
        ));
        subs.add(service.signin(user.login, 'bad password').subscribe(
            () => { },
            (error) => { expect(error.code).toEqual('WRONG_PASSWORD'); subDone(); }
        ));
    });

    it('should signout', done => {
        sessionService.init(session);
        subs.add(service.signout().subscribe(res => {
            expect(res).toBeTruthy();
            done();
        }));
    });

    it('shouldn\'t signout', done => {
        subs.add(service.signout().subscribe(
            () => { },
            (error) => { expect(error.code).toEqual('SESSION_CLOSE_ERROR'); done(); }
        ));
    });

    it('should signup with email only', done => {
        const newUser = <SignupUser>{
            email: 'new.user@mail.com',
            password: 'A1b2c3',
            name: 'Jhon Smith'
        };
        subs.add(service.signup(newUser).subscribe(s => {
            expect(s.user).toBeTruthy();
            expect(s.user.login).toBe(newUser.email);
            expect(s.user.id).toBeTruthy();
            done();
        }));
    });

    it('should signup with login and email', done => {
        const newUser = <SignupUser>{
            login: 'new user2',
            email: 'new.user2@mail.com',
            password: 'A1b2c3',
            name: 'Jhon Smith'
        };
        subs.add(service.signup(newUser).subscribe(s => {
            expect(s.user).toBeTruthy();
            expect(s.user.login).toBe(newUser.login);
            expect(s.user.id).toBeTruthy();
            done();
        }));
    });

    it('shouldn\'t signup', done => {
        const newUser = <SignupUser>{
            login: 'new user3',
            email: 'new.user3@mail.com',
            password: 'A1b2c3',
            name: 'Jhon Smith'
        };
        subs.add(service.signup(newUser).subscribe());
        subs.add(service.signup(newUser).subscribe(
            () => { },
            (error) => { expect(error.code).toEqual('WRONG_LOGIN'); done(); }
        ));
    });

    it('should restore', done => {
        sessionService.init(session);
        subs.add(service.restore(session).subscribe(s => {
            expect(s).toEqual(session);
            done();
        }));
    });

    it('shouldn\'t restore', done => {
        const badSession = cloneDeep(session);
        badSession.id = '11000000000000000000000000000011';
        subs.add(service.restore(badSession).subscribe(
            () => { },
            (error) => { expect(error.code).toEqual('SESSION_NOT_FOUND_ERROR'); done(); }
        ));
    });

});
