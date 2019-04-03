import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';

import { notifications } from './storage';

@Injectable()
export class MockNotificationsInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return of(null).pipe(
            mergeMap(() => {
                if (request.url.match(/\/api\/v1\/notifications\/count/)) {
                    if (request.method === 'GET') {
                        return of(new HttpResponse({
                            status: 200,
                            body: notifications.length
                        }));
                    }
                }
                if (request.url.match(/\/api\/v1\/notifications/)) {
                    if (request.method === 'GET') {
                        return of(new HttpResponse({
                            status: 200,
                            body: {
                                total: notifications.length,
                                data: notifications
                            }
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

export let mockNotificationsProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: MockNotificationsInterceptor,
    multi: true
};
