import { NgModule } from '@angular/core';

import { PipHelpPanelModule } from './help-panel/help-panel.module';

@NgModule({
    imports: [
        PipHelpPanelModule
    ],
    exports: [
        PipHelpPanelModule
    ]
})
export class PipHelpContainersModule { }
