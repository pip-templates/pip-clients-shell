import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import cloneDeep from 'lodash/cloneDeep';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';

import * as utils from '../utility';

@Injectable()
export class MockUsersInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return of(null).pipe(
            mergeMap(() => {
                if (request.url.match(/\/api\/v1\/users\/.{32}\/change_password/) && request.method === 'POST') {
                    // change password
                    const matches = request.url.match(/\/api\/v1\/users\/(.{32})/);
                    let user = utils.users.find(matches[1]);
                    if (!user) {
                        return throwError({
                            'code': 'USER_NOT_FOUND',
                            'status': 400,
                            'name': 'USER_NOT_FOUND',
                            'message': 'User not found',
                        });
                    }
                    if (user.password !== request.body['oldPassword']) {
                        return throwError({
                            'code': 'PASSWORD_DOESNT_MATCH',
                            'status': 400,
                            'name': 'PASSWORD_DOESNT_MATCH',
                            'details': {
                                'oldPassword': request.body['oldPassword']
                            },
                            'message': 'Incorrect password',
                        });
                    }
                    user.password = request.body['newPassword'];
                    user = utils.users.update(user.id, user);
                    return of(new HttpResponse({
                        status: 200,
                        body: user
                    }));
                } else if (request.url.match(/\/api\/v1\/users\/.{32}/)) {
                    const matches = request.url.match(/\/api\/v1\/users\/(.{32})/);
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
                        case 'GET': {
                            const ret = cloneDeep(user);
                            delete ret.password;
                            return of(new HttpResponse({
                                status: 200,
                                body: ret
                            }));
                        }
                        case 'PUT': {
                            const res = utils.users.update(user.id, request.body);
                            if (res) {
                                return of(new HttpResponse({
                                    status: 200,
                                    body: res
                                }));
                            } else {
                                return throwError({
                                    'code': 'USER_UPDATE_ERROR',
                                    'status': 400,
                                    'name': 'USER_UPDATE_ERROR',
                                    'message': 'User update failed',
                                });
                            }
                        }
                        case 'DELETE': {
                            const res = utils.users.delete(user.id);
                            if (res) {
                                return of(new HttpResponse({
                                    status: 200,
                                    body: res
                                }));
                            } else {
                                return throwError({
                                    'code': 'USER_DELETE_ERROR',
                                    'status': 400,
                                    'name': 'USER_DELETE_ERROR',
                                    'message': 'User delete failed',
                                });
                            }
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

export let mockUsersProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: MockUsersInterceptor,
    multi: true
};
