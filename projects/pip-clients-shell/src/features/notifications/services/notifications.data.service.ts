import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Notification } from '../models/index';
import { SessionConfig, SESSION_CONFIG } from '../../session/models/index';
import { DataPage } from '../../../common/index';

@Injectable()
export class NotificationsDataService {
    private RESOURCE = '/api/v1/notifications';
    private RESOURCE_COUNT = '/api/v1/notifications/count';

    public constructor(
        private http: HttpClient,
        @Inject(SESSION_CONFIG) private config: SessionConfig,
    ) {
    }

    private handleError(response: Response) {
        return throwError(response);
    }

    public readNotificationsCount(): Observable<number> {
        const url = this.config.serverUrl + this.RESOURCE_COUNT;

        return this.http.get<number>(url)
            .pipe(catchError(this.handleError));
    }

    public readNotifications(): Observable<DataPage<Notification>> {
        const url = this.config.serverUrl + this.RESOURCE;

        return this.http.get<DataPage<Notification>>(url)
            .pipe(catchError(this.handleError));
    }

}
