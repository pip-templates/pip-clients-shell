import { HttpClientModule } from '@angular/common/http';
import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';
import { sampleSize } from 'lodash';
import { PipMediaModule, PipSidenavModule } from 'pip-webui2-layouts';
import { PipNavModule, PipNavService } from 'pip-webui2-nav';

import { PipSidenavComponent } from './sidenav.component';
import { pipSidenavModule } from './sidenav.module';
import { ApplicationConfig } from '../../../applications/models/ApplicationConfig';
import { ApplicationsConfigService } from '../../../applications/services/applications.config.service';
import { SessionService, defaultSessionConfig, SESSION_CONFIG } from '../../../session';
import { applications, MockSessionService } from '../../../../mock/index';
import { SettingsModule } from '../../../settings/settings.module';

declare const viewport;

export function createApplicationConfig() {
    return new ApplicationsConfigService(<ApplicationConfig>{});
}

describe('SidenavComponent', () => {

    let component: PipSidenavComponent;
    let element: HTMLElement;
    let fixture: ComponentFixture<PipSidenavComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                EffectsModule.forRoot([]),
                pipSidenavModule,
                RouterModule.forRoot([]),
                StoreModule.forRoot({}),
                TranslateModule.forRoot(),
                PipMediaModule.forRoot(),
                PipNavModule.forRoot(),
                PipSidenavModule.forRoot(),
                SettingsModule,
            ],
            providers: [
                {
                    provide: SessionService,
                    useClass: MockSessionService
                },
                {
                    provide: ApplicationsConfigService,
                    useFactory: createApplicationConfig
                },
                {
                    provide: SESSION_CONFIG,
                    useValue: defaultSessionConfig
                }
            ]
        })
            .compileComponents();
        fixture = TestBed.createComponent(PipSidenavComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    xit('should show sites list on mobile', () => {
        const sitesList: HTMLElement = element.querySelector('div');
        viewport.set(1024);
        fixture.detectChanges();
        expect(sitesList.style.display).toEqual('none');
        viewport.set(710);
    });

    it('should send event when site changes', () => {
        const emitSpy = spyOn(component.changeCurrentSite, 'emit');
        component.changeSite(null);
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should toogle sites view', () => {
        component.toggleSitesView();
        expect(component.sitesOpened$.getValue()).toEqual(true);
        component.toggleSitesView();
        expect(component.sitesOpened$.getValue()).toEqual(false);
    });

    it('should update favourites', () => {
        const navService: PipNavService = TestBed.get(PipNavService);
        const showNavMenuSpy = spyOn(navService, 'showNavMenu');
        component.ngOnChanges({ groups: new SimpleChange(undefined, [], true), language: new SimpleChange(undefined, 'en', true) });
        expect(showNavMenuSpy).toHaveBeenCalled();
        component.ngOnChanges({});
    });

    it('should call signout', () => {
        const sessionService: MockSessionService = TestBed.get(SessionService);
        const signoutMenuItem: HTMLButtonElement = element.querySelector('pip-nav-menu mat-list-item:last-child');
        const signoutSpy = spyOn(sessionService, 'signout');
        expect(signoutMenuItem).toBeTruthy();
        signoutMenuItem.click();
        expect(signoutSpy).toHaveBeenCalled();
    });

});
