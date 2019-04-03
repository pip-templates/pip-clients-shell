import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'angular-2-local-storage';
import * as moment_ from 'moment';
import { PipSidenavService, PipRightnavService } from 'pip-webui2-layouts';
import { PipNavService } from 'pip-webui2-nav';
import { PipThemesService } from 'pip-webui2-themes';
import { Subscription, Observable, BehaviorSubject, of } from 'rxjs';
import { distinct } from 'rxjs/operators';

import { shellTranslations } from './shell-container.strings';
import { RightnavState, ShellConfig } from '../models/index';
import { ShellService } from '../services/shell.service';
import { ApplicationsService, ApplicationGroup } from '../../applications/index';
import { HelpPanelService } from '../../help/services/help-panel.service';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { NotificationsPanelService } from '../../notifications/services/notifications-panel.service';
import { SessionService } from '../../session/services/session.service';
import { Site } from '../../sites/index';
import { SitesService } from '../../sites/services/sites.service';
import { EntityState } from '../../../common/index';
import { WINDOW, WindowWrapper } from '../../../common/services/window.service';

const moment = moment_;

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-root',
    templateUrl: './shell-container.component.html',
    styleUrls: ['./shell-container.component.scss']
})
export class ShellContainerComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription = new Subscription();

    public config$: Observable<ShellConfig>;
    public currentSite$: Observable<Site>;
    // public favourites$: Observable<any[]>;
    public applicationsGroups$: Observable<ApplicationGroup[]>;
    public isAuthorized$: Observable<boolean>;
    public language$: BehaviorSubject<string>;
    public rightnav: {
        state$: Observable<RightnavState>,
        title$: Observable<string>,
        showBack$: Observable<boolean>,
        goBackHandler: Function
    };
    public sites$: Observable<Site[]>;
    public sitesState$: Observable<EntityState>;

    constructor(
        private themeService: PipThemesService,

        private applicationsService: ApplicationsService,
        private sessionService: SessionService,
        private localStorageService: LocalStorageService,
        private navService: PipNavService,
        private notificationsService: NotificationsService,
        private rightnavService: PipRightnavService,
        private sidenavService: PipSidenavService,
        private shell: ShellService,
        private sitesService: SitesService,
        private translate: TranslateService,
        @Inject(WINDOW) private window: WindowWrapper,

        private helpPanelService: HelpPanelService,
        private notificationsPanelService: NotificationsPanelService
    ) {
        this.sidenavService.active = true;
        this.config$ = this.shell.config$;
        this.rightnav = {
            state$: this.shell.rightnavState$,
            title$: this.shell.rightnavTitle$,
            showBack$: this.shell.rightnavShowBack$,
            goBackHandler: () => { }
        };
        this.currentSite$ = this.sitesService.current$;
        this.isAuthorized$ = this.sessionService.isAuthorized$;
        this.sites$ = this.sitesService.sites$;
        this.sitesState$ = this.sitesService.state$;

        this.sessionService.restore();

        let lng: string = this.localStorageService.get('language');
        if (!lng) {
            lng = this.sessionService.session
                && this.sessionService.session['user']
                && this.sessionService.session['user']['language']
                ? this.sessionService.session['user']['language']
                : 'en';
        }
        this.language$ = new BehaviorSubject<string>(lng);

        this.translate.setTranslation('en', shellTranslations.en, true);
        this.translate.setTranslation('ru', shellTranslations.ru, true);
        this.subscriptions.add(this.translate.onLangChange.subscribe(lang => {
            this.localStorageService.set('language', lang.lang);
            moment.locale(lang.lang);
        }));
        this.translate.use(this.language$.getValue());

        let skipOnce = true;
        this.subscriptions.add(this.sessionService.session$.pipe(distinct()).subscribe(session => {
            if (session && session['user'] && session['user']['language']) {
                if (skipOnce) { skipOnce = true; return; }
                this.language$.next(session['user']['language']);
                this.translate.use(this.language$.getValue());
            }
            skipOnce = false;
        }));

        this.navService.showNavIcon({
            icon: 'menu',
            action: () => {
                this.sidenavService.toggleOpened();
            }
        });

        this.navService.showPrimaryActions({
            actions: [
                {
                    name: 'notifications',
                    icon: 'notifications',
                    click: () => {
                        this.shell.rightnavState = RightnavState.Notifications;
                        this.rightnav.goBackHandler = this.notificationsPanelService.goBack.bind(this.notificationsPanelService);
                        this.rightnavService.openFloatingRightnav();
                    }
                }
            ]
        });

        this.navService.showSecondaryActions({
            actions: [
                {
                    name: 'usersettings',
                    title: 'APPBAR_USERSETTINGS',
                    click: () => {
                        this.window.location.href = this.window.location.origin + '/usersettings/index.html#';
                    }
                },
                {
                    name: 'help',
                    title: 'APPBAR_HELP',
                    click: () => {
                        this.shell.rightnavState = RightnavState.Help;
                        this.rightnav.goBackHandler = this.helpPanelService.goBack.bind(this.helpPanelService);
                        this.rightnavService.openFloatingRightnav();
                    }
                },
                {
                    name: 'signout',
                    title: 'APPBAR_SIGNOUT',
                    click: () => { this.sessionService.signout(); }
                }
            ]
        });

        this.applicationsGroups$ = this.applicationsService.groups$;
        // this.favourites$ = this.applicationsService.favourites$.pipe(
        //     switchMap(favs => {
        //         if (favs && favs.length) {
        //             return of(favs);
        //         } else {
        //             return this.applicationsService.applications$.pipe(
        //                 map((apps: ApplicationTile[]) =>
        //                     apps.filter(app => this.applicationsConfigService.config.defaultFavouritesIds.includes(app.id)))
        //             );
        //         }
        //     }),
        //     withLatestFrom(this.language$.asObservable()),
        //     map(([favs, language]) => {
        //         const favourites = [];
        //         for (const app of favs) {
        //             const link = <any>{
        //                 name: app.name[language],
        //                 title: app.name[language],
        //                 href: app.url
        //             };
        //             if (app.icon && app.icon.includes('-')) {
        //                 link.fontSet = app.icon.split('-')[0];
        //                 link.icon = app.icon;
        //             } else {
        //                 link.icon = app.icon;
        //             }
        //             favourites.push(link);
        //         }
        //         return favourites;
        //     })
        // );

        this.subscriptions.add(this.translate.onLangChange.subscribe((lang) => {
            this.language$.next(lang.lang);
            const session = this.sessionService.session;
            session['user'].language = lang.lang;
            this.localStorageService.set('session', session);
        }));
    }

    ngOnInit() {
        this.notificationsService.init();
        this.applicationsService.init();
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public changeCurrentSite(site: Site) {
        this.sitesService.current = site;
        if (this.sidenavService.opened) {
            this.sidenavService.closeNav();
        }
    }

    public closeRightnav() {
        this.rightnavService.closeFloatingRightnav();
    }
}
