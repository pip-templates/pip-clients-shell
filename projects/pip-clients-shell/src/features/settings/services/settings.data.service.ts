import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { SessionConfig, SESSION_CONFIG } from '../../session/models/SessionConfig';
import { SessionService } from '../../session/services/session.service';

@Injectable()
export class SettingsDataService {
    private RESOURCE = '/api/v1/settings';

    public constructor(
        private http: HttpClient,
        @Inject(SESSION_CONFIG) private config: SessionConfig,
        private sessionService: SessionService
    ) { }

    private handleError(response: Response) {
        return throwError(response);
    }

    public readSettings(): Observable<Object> {
        // TODO: move to interceptor if needed in route
        if (!this.sessionService.session || !this.sessionService.session.user_id) {
            return throwError(new Error('User not logged in'));
        }
        const url = this.config.serverUrl + this.RESOURCE + '/' + this.sessionService.session.user_id;
        const request: any = {};

        return this.http.get(url, request)
            .pipe(catchError(this.handleError));
    }

    public createSettings(settings: Object): Observable<any> {
        // TODO: move to interceptor if needed in route
        if (!this.sessionService.session || !this.sessionService.session.user_id) {
            return throwError(new Error('User not logged in'));
        }
        const url = this.config.serverUrl + this.RESOURCE + '/' + this.sessionService.session.user_id;
        const request: any = {};

        return this.http.post(url, settings, request)
            .pipe(catchError(this.handleError));
    }
}
