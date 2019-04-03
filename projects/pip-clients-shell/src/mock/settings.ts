import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';

import * as utils from './utility';

@Injectable()
export class MockSettingsInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return of(null).pipe(
            mergeMap(() => {
                if (request.url.match(/\/api\/v1\/settings\/.{32}/)) {
                    const matches = request.url.match(/\/api\/v1\/settings\/(.{32})/);
                    const user = utils.users.find(matches[1]);
                    if (!user) {
                        return throwError({
                            'code': 'USER_NOT_FOUND',
                            'status': 400,
                            'name': 'USER_NOT_FOUND',
                            'message': 'User not found',
                        });
                    }
                    switch (request.method) {
                        case 'GET':
                            return of(new HttpResponse({
                                status: 200,
                                body: user.settings
                            }));
                        case 'POST':
                            const favoritesKeys = Object.keys(request.body).filter(key => key.startsWith('favourites'));
                            for (const fk of favoritesKeys) {
                                if ((<string>request.body[fk]).search('pip_equipment') >= 0) {
                                    return throwError({
                                        'code': 'SETTINGS_SAVE_ERROR',
                                        'status': 400,
                                        'name': 'SETTINGS_SAVE_ERROR',
                                        'message': 'Save error. Settings didn\'t saved',
                                    });
                                }
                            }
                            user.settings = request.body;
                            utils.users.update(user.id, user);
                            return of(new HttpResponse({
                                status: 200,
                                body: user.settings
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

export let mockSettingsProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: MockSettingsInterceptor,
    multi: true
};
