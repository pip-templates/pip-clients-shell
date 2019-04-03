import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { NotificationsService } from '../../services/notifications.service';
import { NotificationsPanelService } from '../../services/notifications-panel.service';
import { Notification, NotificationsPanelState } from '../../models/index';
import { EntityState } from '../../../../common/index';

import { notificationsPanelTranslations } from './notifications-panel.strings';

@Component({
    selector: 'pip-notifications-panel',
    templateUrl: './notification-panel.component.html',
    styleUrls: ['./notification-panel.component.scss']
})
export class PipNotificationPanelComponent implements OnInit {

    public currentNotification$: Observable<Notification>;
    public panelState$: Observable<NotificationsPanelState>;
    public notifications$: Observable<Notification[]>;
    public state$: Observable<EntityState>;

    constructor(
        private notificationsPanelService: NotificationsPanelService,
        private notificationsService: NotificationsService,
        private translate: TranslateService
    ) {
        this.currentNotification$ = this.notificationsPanelService.currentNotification$;
        this.panelState$ = this.notificationsPanelService.state$;
        this.notifications$ = this.notificationsService.notifications$;
        this.state$ = this.notificationsService.state$;

        this.translate.setTranslation('ru', notificationsPanelTranslations.ru, true);
        this.translate.setTranslation('en', notificationsPanelTranslations.en, true);
        this.notificationsPanelService.state = NotificationsPanelState.Notifications;
    }

    ngOnInit() {
        this.notificationsService.read();
    }

    public selectNotification(n: Notification) {
        this.notificationsPanelService.currentNotification = n;
    }

}
