import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PipNotificationsContainersModule } from './containers/containers.module';
import { NotificationsDataService } from './services/notifications.data.service';
import { NotificationsService } from './services/notifications.service';
import { NotificationsPanelService } from './services/notifications-panel.service';
import { notificationsReducer } from './store/notifications.reducer';
import { NotificationsEffects } from './store/index';

@NgModule({
    imports: [
        // Angular and vendors
        StoreModule.forFeature('notifications', notificationsReducer),
        EffectsModule.forFeature([NotificationsEffects]),
        PipNotificationsContainersModule
    ],
    exports: [
        PipNotificationsContainersModule
    ],
    providers: [
        NotificationsDataService,
        NotificationsService,
    ]
})
export class PipNotificationsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: PipNotificationsModule,
            providers: [NotificationsPanelService]
        };
    }
}
