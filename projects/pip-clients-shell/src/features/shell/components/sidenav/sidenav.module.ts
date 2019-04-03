import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule, MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { PipNavMenuModule } from 'pip-webui2-nav';

import { PipSidenavComponent } from './sidenav.component';

@NgModule({
    declarations: [PipSidenavComponent],
    exports: [PipSidenavComponent],
    imports: [
        // Angular and vendors
        CommonModule,
        FlexLayoutModule,
        MatListModule, MatIconModule,
        TranslateModule,
        // pip-suite2 & pip-webui2
        PipNavMenuModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class pipSidenavModule { }
