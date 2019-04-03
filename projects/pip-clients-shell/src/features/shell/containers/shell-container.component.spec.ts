import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { find, sample } from 'lodash';
import { PipSidenavService, PipRightnavService } from 'pip-webui2-layouts';
import { PipNavService, SecondaryAction } from 'pip-webui2-nav';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { ShellContainerComponent } from './shell-container.component';
import { ShellContainerModule } from './shell-container.module';
import { ShellModule } from '../shell.module';
import { RightnavState } from '../models/index';
import { ShellService } from '../services/index';
import { SessionService } from '../../session/index';
import { SitesService } from '../../sites/index';
import { NotificationsService } from '../../notifications/index';
import { notifications, sessions, MockSessionService, MockSitesService } from '../../../mock/index';

describe('[Shell] containers/shell-container.component', () => {

    let component: ShellContainerComponent;
    let element: HTMLElement;
    let fixture: ComponentFixture<ShellContainerComponent>;

    let subs: Subscription;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                RouterModule.forRoot([]),
                ShellModule.forMock(),
                ShellContainerModule
            ],
            providers: [
                {
                    provide: SessionService,
                    useClass: MockSessionService
                },
                {
                    provide: SitesService,
                    useClass: MockSitesService
                }
            ]
        })
            .compileComponents();
        fixture = TestBed.createComponent(ShellContainerComponent);
        component = fixture.componentInstance;
        const sessionService: MockSessionService = TestBed.get(SessionService);
        const sitesService: MockSitesService = TestBed.get(SitesService);
        spyOn(sessionService, 'restore').and.callThrough();
        sessionService.init(sessions[0]);
        sitesService.init();
        fixture.detectChanges();
        element = fixture.nativeElement;
        subs = new Subscription();
    }));

    // beforeAll(() => {
    //     localStorage.clear();
    // });

    afterEach(() => { subs.unsubscribe(); });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should destroy', () => {
        spyOn(component['subscriptions'], 'unsubscribe');
        component.ngOnDestroy();
        expect(component['subscriptions'].unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should open and close sidenav', async () => {
        const menuIcon: HTMLButtonElement = element.querySelector('pip-nav-icon button');
        const matSidenav: HTMLElement = element.querySelector('mat-sidenav.pip-sidenav');
        const sidenavService: PipSidenavService = TestBed.get(PipSidenavService);
        expect(sidenavService.opened).toBe(false);
        expect([matSidenav.style.visibility, matSidenav.style.boxShadow]).toEqual(['hidden', 'none']);
        menuIcon.click();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(sidenavService.opened).toBe(true);
        expect([matSidenav.style.visibility, matSidenav.style.boxShadow]).toEqual(['visible', '']);
        menuIcon.click();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(sidenavService.opened).toBe(false);
        expect([matSidenav.style.visibility, matSidenav.style.boxShadow]).toEqual(['hidden', 'none']);
    });

    it('should show sites menu', () => {
        const sitesButton: HTMLButtonElement = element.querySelector('.pip-shell-sites-button');
        expect(sitesButton).toBeTruthy();
        const sitesButtonText: HTMLElement = sitesButton.querySelector('span span');
        const sitesService: MockSitesService = TestBed.get(SitesService);
        expect(sitesButtonText.innerText).toEqual(sitesService.current.name);
    });

    it('notifications should got count', async (done) => {
        const notificationsService: NotificationsService = TestBed.get(NotificationsService);
        subs.add(notificationsService.count$.pipe(filter(c => c > 0)).subscribe(cnt => {
            expect(cnt).toEqual(notifications.length);
            done();
        }));
    });

    it('should open rightnav with notifications', async () => {
        // tslint:disable-next-line:max-line-length
        const notificationsButton: HTMLButtonElement = element.querySelector('pip-primary-actions .pip-action-notifications button mat-icon');
        const matRightnav: HTMLElement = element.querySelector('pip-root-layout mat-sidenav.pip-rightnav');
        const rightnavService: PipRightnavService = TestBed.get(PipRightnavService);
        const shellService: ShellService = TestBed.get(ShellService);
        expect([matRightnav.style.visibility, matRightnav.style.boxShadow]).toEqual(['hidden', 'none']);
        notificationsButton.click();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(rightnavService.opened).toBe(true);
        expect(matRightnav.style.visibility).toEqual('visible');
        expect(shellService.rightnavState).toEqual(RightnavState.Notifications);
        expect(shellService.rightnavShowBack).toBeFalsy();
        component.closeRightnav();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(rightnavService.opened).toBe(false);
        expect(matRightnav.style.visibility).toEqual('hidden');
    });

    it('should open rightnav with help', async () => {
        const matRightnav: HTMLElement = element.querySelector('pip-root-layout mat-sidenav.pip-rightnav');
        const rightnavService: PipRightnavService = TestBed.get(PipRightnavService);
        const navService: PipNavService = TestBed.get(PipNavService);
        const shellService: ShellService = TestBed.get(ShellService);
        const sa = navService.getItem('secondary-actions');
        const helpAction: SecondaryAction = find(sa.properties.getValue()['actions'], ['name', 'help']);
        expect([matRightnav.style.visibility, matRightnav.style.boxShadow]).toEqual(['hidden', 'none']);
        helpAction.click();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(rightnavService.opened).toBe(true);
        expect(matRightnav.style.visibility).toEqual('visible');
        expect(shellService.rightnavState).toEqual(RightnavState.Help);
        expect(shellService.rightnavShowBack).toBeFalsy();
    });

    it('should change current site', () => {
        const sidenavService: PipSidenavService = TestBed.get(PipSidenavService);
        const sitesService: MockSitesService = TestBed.get(SitesService);
        sidenavService.toggleOpened();
        component.changeCurrentSite(sample(sitesService.sites.filter(s => s.name !== sitesService.current.name)));
        fixture.detectChanges();
        const sitesSpan: HTMLElement = element.querySelector('.pip-shell-sites-button span span');
        expect(sitesSpan.innerText).toEqual(sitesService.current.name);
    });

});
