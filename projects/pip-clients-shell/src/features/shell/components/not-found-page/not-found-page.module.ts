import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PipEmptyStateModule } from 'pip-webui2-controls';

import { NotFoundPagePageComponent } from './not-found-page.component';

@NgModule({
    declarations: [NotFoundPagePageComponent],
    exports: [NotFoundPagePageComponent],
    imports: [
        // Angular and vendors
        CommonModule,
        FlexLayoutModule,
        RouterModule,
        TranslateModule,
        // pip-suite2 & pip-webui2
        PipEmptyStateModule,
    ]
})
export class NotFoundPageModule { }
