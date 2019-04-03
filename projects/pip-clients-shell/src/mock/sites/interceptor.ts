import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';

import { Site } from '../../features/sites/models/Site';
import * as utils from '../utility';

@Injectable()
export class MockSitesInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return of(null).pipe(
            mergeMap(() => {
                const session = utils.sessions.find(request.headers.get('x-session-id'));
                if (!session) {
                    return throwError({
                        'code': 'SESSION_NOT_FOUND_ERROR',
                        'status': 400,
                        'name': 'SESSION_NOT_FOUND_ERROR',
                        'message': 'Session not found',
                    });
                }
                if (!session.active) {
                    return throwError({
                        'code': 'SESSION_CLOSED_ERROR',
                        'status': 400,
                        'name': 'SESSION_CLOSED_ERROR',
                        'message': 'Session closed',
                    });
                }
                let matches = request.url.match(/\/api\/v1\/sites\/(.{32})/);
                if (matches) {
                    matches = request.url.match(/\/api\/v1\/sites\/(.{32})\/connect/);
                    if (matches && request.method === 'POST') {
                        const res = utils.userSites.connect(session.user_id, matches[1]);
                        if (res === 0) {
                            return throwError({
                                'code': 'SITE_ALREADY_CONNECTED_ERROR',
                                'status': 400,
                                'name': 'SITE_ALREADY_CONNECTED_ERROR',
                                'message': 'Site already connected to user',
                            });
                        } else if (res === 1) {
                            return throwError({
                                'code': 'SITE_NOT_FOUND_ERROR',
                                'status': 400,
                                'name': 'SITE_NOT_FOUND_ERROR',
                                'message': 'Site not found',
                            });
                        } else {
                            return of(new HttpResponse({
                                status: 200,
                                body: res
                            }));
                        }
                    }
                    matches = request.url.match(/\/api\/v1\/sites\/(.{32})\/disconnect/);
                    if (matches && request.method === 'POST') {
                        const res = utils.userSites.disconnect(session.user_id, matches[1]);
                        if (res === 0) {
                            return throwError({
                                'code': 'SITE_ALREADY_DISCONNECTED_ERROR',
                                'status': 400,
                                'name': 'SITE_ALREADY_DISCONNECTED_ERROR',
                                'message': 'Site didn\'t connect to user',
                            });
                        } else if (res === 1) {
                            return throwError({
                                'code': 'SITE_NOT_FOUND_ERROR',
                                'status': 400,
                                'name': 'SITE_NOT_FOUND_ERROR',
                                'message': 'Site not found',
                            });
                        } else if (res === 2) {
                            return throwError({
                                'code': 'SITE_DISCONNECT_CURRENT_ERROR',
                                'status': 400,
                                'name': 'SITE_DISCONNECT_CURRENT_ERROR',
                                'message': 'Cannot disconnect user from current site',
                            });
                        } else {
                            return of(new HttpResponse({
                                status: 200,
                                body: res
                            }));
                        }
                    }
                }
                if (request.url.match(/\/api\/v1\/sites/)) {
                    if (request.method === 'GET') {
                        let sites: Site[];
                        if (request.params.get('filter')) {
                            sites = utils.sites.find(request.params.get('filter'));
                        } else {
                            sites = utils.userSites.find(session.user_id);
                        }
                        return of(new HttpResponse({
                            status: 200,
                            body: {
                                total: sites.length,
                                data: sites
                            }
                        }));
                    }
                    if (request.method === 'POST') {
                        const site = utils.sites.create(request.body, session.user);
                        utils.userSites.connect(session.user_id, site.id);
                        return of(new HttpResponse({
                            status: 200,
                            body: site
                        }));
                    }
                }
                return next.handle(request);
            }),
            materialize(),
            delay(500),
            dematerialize()
        );
    }
}

export let mockSitesProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: MockSitesInterceptor,
    multi: true
};
