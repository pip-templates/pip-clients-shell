import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';

import { sites } from '../storage';
import { EntityState } from '../../common/index';
import { Site } from '../../features/sites/models/index';

@Injectable()
export class MockSitesService {

    private _error$: BehaviorSubject<any>;
    private _sites$: BehaviorSubject<Site[]>;
    private _site$: BehaviorSubject<Site>;

    constructor() {
        this._error$ = new BehaviorSubject<any>(null);
        this._sites$ = new BehaviorSubject<Site[]>([]);
        this._site$ = new BehaviorSubject<Site>(null);
    }

    public init(): void {
        this._sites$.next(sites);
        if (sites && sites.length) {
            this._site$.next(sites[0]);
        }
    }

    public read(): void {
        this.init();
    }

    public get sites$(): Observable<Site[]> {
        return this._sites$.asObservable();
    }

    public get sites(): Site[] {
        return this._sites$.getValue();
    }

    public get current$(): Observable<Site> {
        return this._site$.asObservable();
    }

    public get current(): Site {
        return this._site$.getValue();
    }

    public set current(site: Site) {
        this._site$.next(site);
    }

    public get state$(): Observable<EntityState> {
        return of(EntityState.Data);
    }

    public get error$(): Observable<any> {
        return this._error$.asObservable();
    }

    public get error(): any {
        return this._error$.getValue();
    }

    public set error(val: any) {
        this._error$.next(val);
    }
}
