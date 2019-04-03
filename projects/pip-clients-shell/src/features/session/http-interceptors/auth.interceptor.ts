import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { SessionService } from '../services/session.service';

@Injectable()
export class SessionAuthInterceptor implements HttpInterceptor {

    constructor(private sessionService: SessionService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Get the session id
        const sesionId = this.sessionService.session ? this.sessionService.session.id : null;

        // Clone the request and replace the original headers with
        // cloned headers, updated with the authorization.
        let newHeader;
        if (!(req.body && req.body.constructor && req.body.constructor.name === 'FormData')) {
            newHeader = req.headers.set('content-type', 'application/json');
        }
        if (sesionId && !req.headers.get('x-session-id')) { newHeader = req.headers.set('x-session-id', sesionId); }

        const authReq = req.clone({
            headers: newHeader // req.headers.set('x-session-id', sesionId)
        });

        // send cloned request with header to the next handler.
        return next.handle(authReq);
    }
}

export const SessionAuthInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: SessionAuthInterceptor,
    multi: true
};
