import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconModule, MatMenuModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import {
    PipAppbarModule,
    PipMainLayoutAltModule,
    PipRootLayoutModule,
    PipShadowModule,
} from 'pip-webui2-layouts';
import {
    PipBreadcrumbModule,
    PipNavIconModule,
    PipPrimaryActionsModule,
    PipSecondaryActionsModule,
} from 'pip-webui2-nav';

import { ShellContainerComponent } from './shell-container.component';
import { pipSidenavModule } from '../components/index';
import { ApplicationsModule } from '../../applications/index';
import { PipHelpModule } from '../../help/index';
import { PipNotificationsModule } from '../../notifications/index';

@NgModule({
    declarations: [ShellContainerComponent],
    exports: [ShellContainerComponent],
    imports: [
        // Angular and vendors
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        RouterModule,
        TranslateModule,
        // pip-suite2 & pip-webui2
        PipAppbarModule,
        PipBreadcrumbModule,
        PipMainLayoutAltModule,
        PipNavIconModule,
        PipPrimaryActionsModule,
        PipRootLayoutModule,
        PipShadowModule,
        PipSecondaryActionsModule,
        // pip-clients
        ApplicationsModule,
        PipHelpModule.forRoot(),
        PipNotificationsModule.forRoot(),
        pipSidenavModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShellContainerModule { }
