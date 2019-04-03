import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';

import { Session, User } from '../../features/session/models/index';
import * as utils from '../utility';

@Injectable()
export class MockSessionDataService {
    public constructor() { }

    private handleError(response: Response) {
        return throwError(response);
    }

    public signin(login: string, password: string): Observable<Session> {
        const user: User = utils.users.find(login);
        if (user && user.password === password) {
            return of(utils.sessions.create(user));
        } else {
            const response: any = !user ? {
                'code': 'WRONG_LOGIN',
                'status': 400,
                'name': 'WRONG_LOGIN',
                'details': {
                    'login': login
                },
                'message': `Account ${login} was not found`,
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
}
