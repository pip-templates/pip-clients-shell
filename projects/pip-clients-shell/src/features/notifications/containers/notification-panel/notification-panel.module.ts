import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatListModule, MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { MomentModule } from 'ngx-moment';
import { PipEmptyStateModule } from 'pip-webui2-controls';

import { PipNotificationPanelComponent } from './notification-panel.component';

@NgModule({
    declarations: [PipNotificationPanelComponent],
    exports: [PipNotificationPanelComponent],
    imports: [
        // Angular and vendors
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatListModule,
        MatIconModule,
        MomentModule,
        TranslateModule,
        // pip-suite2 & pip-webui2
        PipEmptyStateModule
    ]
})
export class PipNotificationPanelModule { }
