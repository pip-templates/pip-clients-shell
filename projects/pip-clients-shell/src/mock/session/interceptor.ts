import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';

import { User } from '../../features/session/models/index';
import * as utils from '../utility';

@Injectable()
export class MockSessionInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return of(null).pipe(
            mergeMap(() => {
                if (request.url.match(/\/api\/v1\/signin/) && request.method === 'POST') {
                    const user: User = utils.users.find(request.body['login']);
                    if (user && user.password === request.body['password']) {
                        return of(new HttpResponse({
                            status: 200,
                            body: utils.sessions.create(user)
                        }));
                    } else {
                        const response: any = !user ? {
                            'code': 'WRONG_LOGIN',
                            'status': 400,
                            'name': 'WRONG_LOGIN',
                            'details': {
                                'login': request.body['login']
                            },
                            'message': `Account ${request.body['login']} was not found`,
                        } : {
                                'code': 'WRONG_PASSWORD',
                                'status': 400,
                                'name': 'WRONG_PASSWORD',
                                'details': {
                                    'login': user.login
                                },
                                'message': 'Wrong password for account ' + user.login,
                            };
                        return throwError(response);
                    }
                }
                if (request.url.match(/\/api\/v1\/signup/) && request.method === 'POST') {
                    let user: User = utils.users.find(request.body['login']);
                    if (user) {
                        return throwError({
                            'code': 'WRONG_LOGIN',
                            'status': 400,
                            'name': 'WRONG_LOGIN',
                            'details': {
                                'login': request.body['login']
                            },
                            'message': `Account ${request.body['login']} already exists`,
                        });
                    } else {
                        user = <User>{
                            id: '',
                            email: request.body['email'],
                            login: request.body['login'],
                            password: request.body['password'],
                            name: request.body['name'],
                            language: request.body['language'] || 'en',
                            theme: request.body['theme'] || 'pip-light-theme'
                        };
                        user = utils.users.create(user);
                        const session = utils.sessions.create(user);
                        return of(new HttpResponse({
                            status: 200,
                            body: session
                        }));
                    }
                }
                if (request.url.match(/\/api\/v1\/sessions\/restore/) && request.method === 'POST') {
                    const session = utils.sessions.find(request.body['session_id']);
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
                    return of(new HttpResponse({
                        status: 200,
                        body: session
                    }));
                }
                if (request.url.match(/\/api\/v1\/sessions\/history/) && request.method === 'GET') {
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
                    const sessions = utils.sessions.findByUser(session.user_id);
                    if (sessions.length < 3) {
                        const toCreateLength = 3 - sessions.length;
                        for (let i = 0; i < toCreateLength; i++) {
                            sessions.push(utils.sessions.createClosed(session.user));
                        }
                    }
                    return of(new HttpResponse({
                        status: 200,
                        body: sessions
                    }));
                }
                if (request.url.match(/\/api\/v1\/signout/) && request.method === 'POST') {
                    const result = utils.sessions.close(request.headers.get('x-session-id'));
                    return result ? of(new HttpResponse({
                        status: 200,
                        body: true
                    })) : throwError({
                        'code': 'SESSION_CLOSE_ERROR',
                        'status': 400,
                        'name': 'SESSION_CLOSE_ERROR',
                        'message': 'Session close error',
                    });
                }
                if (request.url.match(/\/api\/v1\/sessions\/close_all/) && request.method === 'POST') {
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
                    utils.sessions.closeAll(session.user_id);
                    return of(new HttpResponse({
                        status: 200,
                        body: true
                    }));
                }

                return next.handle(request);
            }),
            materialize(),
            delay(500),
            dematerialize()
        );
    }
}

export let mockSessionProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: MockSessionInterceptor,
    multi: true
};
