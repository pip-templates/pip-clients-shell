import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatInputModule, MatListModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { PipSearchInputModule } from 'pip-webui2-controls';
import { PipScrollableModule } from 'pip-webui2-layouts';

import { PipHelpPanelComponent } from './help-panel.component';
import { HelpListModule } from '../../components/help-list/help-list.module';

@NgModule({
    declarations: [PipHelpPanelComponent],
    exports: [PipHelpPanelComponent],
    imports: [
        // Angular and vendors
        CommonModule,
        ReactiveFormsModule,
        MatIconModule,
        MatInputModule,
        TranslateModule,
        // pip-suite2 & pip-webui2
        PipScrollableModule,
        PipSearchInputModule,
        // pip-clients
        HelpListModule,
    ]
})
export class PipHelpPanelModule { }
