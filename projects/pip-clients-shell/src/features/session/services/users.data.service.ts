import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { User } from '../models/index';
import { SessionConfig, SESSION_CONFIG } from '../../session/models/SessionConfig';

@Injectable()
export class UsersDataService {

    private RESOURCE = '/api/v1/users';

    public constructor(
        private http: HttpClient,
        @Inject(SESSION_CONFIG) private config: SessionConfig,
    ) { }

    private handleError(response: Response) {
        return throwError(response);
    }

    public readUser(id: string): Observable<User> {
        const url = this.config.serverUrl + this.RESOURCE + '/' + id;

        return this.http.get<User>(url)
            .pipe(catchError(this.handleError));
    }

    public updateUser(user: User): Observable<User> {
        const url = this.config.serverUrl + this.RESOURCE + '/' + user.id;

        return this.http.put<User>(url, user)
            .pipe(catchError(this.handleError));
    }

    public deleteUser(id: User | string): Observable<any> {
        const uid = typeof id === 'string' ? id : id.id;
        const url = this.config.serverUrl + this.RESOURCE + '/' + uid;
        const request: any = {};

        return this.http.delete(url, request)
            .pipe(
                map(() => uid),
                catchError(this.handleError)
            );
    }

    public changePassword(id: User | string, oldPassword: string, newPassword: string): Observable<boolean> {
        const uid = typeof id === 'string' ? id : id.id;
        const url = this.config.serverUrl + this.RESOURCE + '/' + uid + '/change_password';
        const request: any = {
            oldPassword,
            newPassword
        };

        return this.http.post<boolean>(url, request)
            .pipe(catchError(this.handleError));
    }

}
