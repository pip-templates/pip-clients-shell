import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { NgModule, APP_INITIALIZER, InjectionToken } from '@angular/core';
import { BREAKPOINT } from '@angular/flex-layout';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import {
    LocalStorageModule,
    LocalStorageService
} from 'angular-2-local-storage';
import merge from 'lodash/merge';
import {
    PipMediaModule,
    PipRightnavModule,
    PipSidenavModule
} from 'pip-webui2-layouts';
import { PipNavModule } from 'pip-webui2-nav';
import { PipThemesModule, THEMES_CONFIG, ThemesConfig } from 'pip-webui2-themes';

import { PIP_BREAKPOINTS } from './breakpoints';
import { ShellRoutingModule } from './shell-routing.module';
import { ShellComponentsModule } from './components/index';
import { ShellContainerModule } from './containers/index';
import { SHELL_CONFIG, defaultShellConfig, ShellConfig } from './models/index';
import { ShellService } from './services/shell.service';
import {
    ApplicationConfig,
    ApplicationsConfigService
} from '../applications/index';
import { PipNotificationsModule } from '../notifications/index';
import {
    AuthGuard,
    SessionModule,
    SESSION_CONFIG,
    defaultSessionConfig,
    SessionConfig
} from '../session/index';
import { SessionAuthInterceptorProvider } from '../session/http-interceptors/auth.interceptor';
import { SettingsModule } from '../settings/index';
import { SitesModule } from '../sites/index';
import { WINDOW_PROVIDERS } from '../../common/services/window.service';

import { mockApplicationsProvider } from '../../mock/applications';
import { mockNotificationsProvider } from '../../mock/notifications';
import { mockSessionProvider } from '../../mock/session/interceptor';
import { mockSettingsProvider } from '../../mock/settings';
import { mockSitesProvider } from '../../mock/sites/interceptor';
import { mockUsersProvider } from '../../mock/users/interceptor';
import { MockInitService } from '../../mock/init';

const applicationConfig: ApplicationConfig = <ApplicationConfig>{
    favouritesGroupName: 'favourites'
};

const FR_CONFIGS = new InjectionToken<ShellModuleConfig>('For root configs');

export function createSessionConfig(forRootConfigs: ShellModuleConfig) {
    return forRootConfigs && forRootConfigs.entry
        ? merge({}, defaultSessionConfig, forRootConfigs.entry)
        : defaultSessionConfig;
}

export function createShellConfig(forRootConfigs: ShellModuleConfig) {
    return forRootConfigs && forRootConfigs.shell
        ? merge({}, defaultShellConfig, forRootConfigs.shell)
        : defaultShellConfig;
}

export function createApplicationConfig() {
    return new ApplicationsConfigService(applicationConfig);
}

export function mockInit(mis: MockInitService) {
    return () => mis.init();
}

export interface ShellModuleConfig {
    entry?: Partial<SessionConfig>;
    shell?: Partial<ShellConfig>;
}

// @dynamic
@NgModule({
    imports: [
        // Angular and vendors
        EffectsModule.forRoot([]),
        HttpClientModule,
        LocalStorageModule.withConfig({
            prefix: 'pip-clients',
            storageType: 'localStorage'
        }),
        StoreModule.forRoot({}),
        TranslateModule.forRoot(),
        // pip-suite2 & pip-webui2
        PipNavModule.forRoot(),
        PipMediaModule.forRoot(),
        PipRightnavModule.forRoot(),
        PipSidenavModule.forRoot(),
        PipThemesModule.forRoot(),
        // pip-clients
        ShellRoutingModule,
        ShellComponentsModule,
        ShellContainerModule,
        PipNotificationsModule,
        SessionModule,
        SettingsModule,
        SitesModule
    ]
})
export class ShellModule {
    static forRoot(configs?: ShellModuleConfig): ModuleWithProviders {
        return {
            ngModule: ShellModule,
            providers: [
                AuthGuard,
                {
                    provide: FR_CONFIGS,
                    useValue: configs
                },
                {
                    provide: SESSION_CONFIG,
                    useFactory: createSessionConfig,
                    deps: [FR_CONFIGS]
                },
                SessionAuthInterceptorProvider,
                {
                    provide: ApplicationsConfigService,
                    useFactory: createApplicationConfig
                },
                ShellService,
                {
                    provide: SHELL_CONFIG,
                    useFactory: createShellConfig,
                    deps: [FR_CONFIGS]
                },
                WINDOW_PROVIDERS,
                {
                    provide: BREAKPOINT,
                    useValue: [...PIP_BREAKPOINTS]
                }
            ]
        };
    }

    static forMock(configs?: ShellModuleConfig): ModuleWithProviders {
        return {
            ngModule: ShellModule,
            providers: [
                AuthGuard,
                {
                    provide: FR_CONFIGS,
                    useValue: configs
                },
                {
                    provide: SESSION_CONFIG,
                    useFactory: createSessionConfig,
                    deps: [FR_CONFIGS]
                },
                SessionAuthInterceptorProvider,
                {
                    provide: ApplicationsConfigService,
                    useFactory: createApplicationConfig
                },
                ShellService,
                {
                    provide: SHELL_CONFIG,
                    useFactory: createShellConfig,
                    deps: [FR_CONFIGS]
                },
                WINDOW_PROVIDERS,
                {
                    provide: BREAKPOINT,
                    useValue: [...PIP_BREAKPOINTS]
                },
                // Mock providers
                mockApplicationsProvider,
                mockNotificationsProvider,
                mockSessionProvider,
                mockSettingsProvider,
                mockSitesProvider,
                mockUsersProvider,
                MockInitService,
                {
                    provide: APP_INITIALIZER,
                    useFactory: mockInit,
                    multi: true,
                    deps: [MockInitService, LocalStorageService, SESSION_CONFIG]
                }
            ]
        };
    }
}
