import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule, MatIconModule } from '@angular/material';

import { HelpListComponent } from './help-list.component';

@NgModule({
    declarations: [HelpListComponent],
    exports: [HelpListComponent],
    imports: [
        // Angular and vendors
        CommonModule,
        FlexLayoutModule,
        MatIconModule,
        MatListModule
    ]
})
export class HelpListModule { }
