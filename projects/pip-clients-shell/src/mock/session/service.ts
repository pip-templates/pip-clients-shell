import { Session } from '../../features/session/models/Session';
import { Observable, BehaviorSubject } from 'rxjs';

export class MockSessionService {

    private _isAuthorized$: BehaviorSubject<boolean>;
    private _session$: BehaviorSubject<Session>;

    constructor() {
        this._isAuthorized$ = new BehaviorSubject<boolean>(false);
        this._session$ = new BehaviorSubject<Session>(null);
    }

    public init(session: Session) {
        this._session$.next(session);
        if (this.session && !this.isAuthorized) {
            this._isAuthorized$.next(true);
        } else if (!this.session && this.isAuthorized) {
            this._isAuthorized$.next(false);
        }
    }

    public get session$(): Observable<Session> {
        return this._session$.asObservable();
    }

    public get session(): Session {
        return this._session$.getValue();
    }

    public get isAuthorized$(): Observable<boolean> {
        return this._isAuthorized$.asObservable();
    }

    public get isAuthorized(): boolean {
        return this._isAuthorized$.getValue();
    }

    public signout() { this.init(null); }

    public restore() { }
}
