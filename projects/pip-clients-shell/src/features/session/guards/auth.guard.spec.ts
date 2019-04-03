import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SessionService } from '../services/session.service';
import { SESSION_CONFIG, defaultSessionConfig, SessionConfig } from '../models/index';
import { users, utils, mockSessionProvider, MockSessionService } from '../../../mock/index';

import { WINDOW, WindowWrapper } from '../../../common/services/window.service';
import { AuthGuard } from './auth.guard';
import { RouterModule, Router } from '@angular/router';

@Component({
    selector: 'pip-mock',
    template: '<div></div>',
})
export class MockComponent { }

describe('[Session] guards/auth', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [MockComponent],
            imports: [
                RouterModule.forRoot([
                    { path: 'example', component: MockComponent, canActivate: [AuthGuard] },
                    { path: 'another', component: MockComponent },
                ])
            ],
            providers: [
                AuthGuard,
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
        })
            .compileComponents();
    });

    it('should verify', async () => {
        const sessionService: MockSessionService = TestBed.get(SessionService);
        const router: Router = TestBed.get(Router);
        const w: WindowWrapper = TestBed.get(WINDOW);
        const config: SessionConfig = TestBed.get(SESSION_CONFIG);
        expect(await router.navigate(['example'])).toBeFalsy();
        expect(w.location.href).toEqual(w.location.origin + config.unautorizedUrl);
        sessionService.init(utils.sessions.create(users[0]));
        expect(await router.navigate(['example'])).toBeTruthy();
    });

});
