import { NgModule } from '@angular/core';

import { PipNotificationPanelModule } from './notification-panel/notification-panel.module';

@NgModule({
  imports: [PipNotificationPanelModule],
  exports: [PipNotificationPanelModule]
})
export class PipNotificationsContainersModule { }
