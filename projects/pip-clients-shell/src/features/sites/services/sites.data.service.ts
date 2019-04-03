import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Site } from '../models/index';
import { SessionConfig, SESSION_CONFIG } from '../../session/models/SessionConfig';
import { DataPage } from '../../../common/index';

@Injectable()
export class SitesDataService {
    private RESOURCE = '/api/v1/sites';

    public constructor(
        private http: HttpClient,
        @Inject(SESSION_CONFIG) private config: SessionConfig,
    ) { }

    private handleError(response: Response) {
        return throwError(response);
    }

    public readSites(filter?: string): Observable<DataPage<Site>> {
        const url = this.config.serverUrl + this.RESOURCE;
        let params = new HttpParams();
        if (filter) { params = params.set('filter', filter); }
        return this.http.get<DataPage<Site>>(url, { params })
            .pipe(catchError(this.handleError));
    }

    // TODO: mocking not implemented for this
    public readSite(siteId: string): Observable<Site> {
        const url = this.config.serverUrl + this.RESOURCE + '/' + siteId;
        return this.http.get<Site>(url)
            .pipe(catchError(this.handleError));
    }

    public createSite(data: Site): Observable<Site> {
        const url = this.config.serverUrl + this.RESOURCE;
        return this.http.post<Site>(url, data)
            .pipe(catchError(this.handleError));
    }

    public connectToSite(siteId: string): Observable<Site> {
        const url = this.config.serverUrl + this.RESOURCE + '/' + siteId + '/connect';
        return this.http.post<Site>(url, {})
            .pipe(catchError(this.handleError));
    }

    public disconnectFromSite(siteId: string): Observable<Site> {
        const url = this.config.serverUrl + this.RESOURCE + '/' + siteId + '/disconnect';
        return this.http.post<Site>(url, {})
            .pipe(catchError(this.handleError));
    }
}
