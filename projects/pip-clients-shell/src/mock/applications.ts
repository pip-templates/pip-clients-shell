import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';

import * as utils from './utility';
import { applications } from './storage';
import { Application } from '../features/applications/models/index';

@Injectable()
export class MockApplicationsInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return of(null).pipe(
            mergeMap(() => {
                if (request.url.match(/\/api\/v1\/applications/)) {
                    switch (request.method) {
                        case 'GET': {
                            return of(new HttpResponse({
                                status: 200,
                                body: {
                                    total: applications.length,
                                    data: applications
                                }
                            }));
                        }
                        case 'POST': {
                            const res = utils.applications.create(request.body);
                            if (!res) {
                                return throwError({
                                    'code': 'APPLICATION_ALREADY_EXISTS',
                                    'status': 400,
                                    'name': 'APPLICATION_ALREADY_EXISTS',
                                    'message': 'Application already exists',
                                });
                            } else {
                                return of(new HttpResponse({
                                    status: 200,
                                    body: res
                                }));
                            }
                        }
                        case 'PUT': {
                            const matches = request.url.match(/\/api\/v1\/applications\/(.*)$/);
                            const appNotFoundToThrow = {
                                'code': 'APPLICATION_NOT_FOUND',
                                'status': 400,
                                'name': 'APPLICATION_NOT_FOUND',
                                'message': 'Application not found',
                            };
                            if (!matches) { return throwError(appNotFoundToThrow); }
                            const res = utils.applications.update(request.body);
                            if (!res) { return throwError(appNotFoundToThrow); }
                            return of(new HttpResponse({
                                status: 200,
                                body: res
                            }));
                        }
                        case 'DELETE': {
                            const matches = request.url.match(/\/api\/v1\/applications\/(.*)$/);
                            const appNotFoundToThrow = {
                                'code': 'APPLICATION_NOT_FOUND',
                                'status': 400,
                                'name': 'APPLICATION_NOT_FOUND',
                                'message': 'Application not found',
                            };
                            if (!matches) { return throwError(appNotFoundToThrow); }
                            const res = utils.applications.delete(matches[1]);
                            if (!res) { return throwError(appNotFoundToThrow); }
                            return of(new HttpResponse({
                                status: 200,
                                body: res
                            }));
                        }
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

export let mockApplicationsProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: MockApplicationsInterceptor,
    multi: true
};
