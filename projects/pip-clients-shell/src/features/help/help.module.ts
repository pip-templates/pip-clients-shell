import { NgModule, ModuleWithProviders } from '@angular/core';

import { HelpPanelComponentsModule } from './components/components.module';
import { PipHelpContainersModule } from './containers/containers.module';
import { HelpPanelService } from './services/help-panel.service';

@NgModule({
    imports: [
        HelpPanelComponentsModule,
        PipHelpContainersModule
    ],
    exports: [
        HelpPanelComponentsModule,
        PipHelpContainersModule
    ]
})
export class PipHelpModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: PipHelpModule,
            providers: [
                HelpPanelService
            ]
        };
    }
}
