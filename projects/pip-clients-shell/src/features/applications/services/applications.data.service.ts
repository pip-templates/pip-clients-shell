import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Application, ApplicationTile } from '../models/index';
import { SessionConfig, SESSION_CONFIG } from '../../session/models/SessionConfig';

@Injectable()
export class ApplicationsDataService {

    private RESOURCE = '/api/v1/applications';

    public constructor(
        private http: HttpClient,
        @Inject(SESSION_CONFIG) private config: SessionConfig,
    ) { }

    private handleError(response: Response) {
        return throwError(response);
    }

    public readApplications(): Observable<ApplicationTile[]> {
        const url = this.config.serverUrl + this.RESOURCE;
        const request: any = {};

        return this.http.get(url, request)
            .pipe(
                map(response => response['data']),
                catchError(this.handleError)
            );
    }

    public updateApplication(app: Application): Observable<any> {
        const url = this.config.serverUrl + this.RESOURCE + '/' + app.id;
        const request: any = {};

        return this.http.put(url, app, request)
            .pipe(catchError(this.handleError));
    }

    public createApplication(app: Application): Observable<any> {
        const url = this.config.serverUrl + this.RESOURCE;
        const request: any = {};

        return this.http.post(url, app, request)
            .pipe(catchError(this.handleError));
    }

    public deleteApplication(id: Application | string): Observable<any> {
        const aid = typeof id === 'string' ? id : id.id;
        const url = this.config.serverUrl + this.RESOURCE + '/' + aid;
        const request: any = {};

        return this.http.delete(url, request)
            .pipe(
                map(() => aid),
                catchError(this.handleError)
            );
    }

}
