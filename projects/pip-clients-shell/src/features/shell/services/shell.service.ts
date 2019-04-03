import { Injectable, Inject } from '@angular/core';
import merge from 'lodash/merge';
import { BehaviorSubject, Observable } from 'rxjs';

import { RightnavState, ShellConfig, SHELL_CONFIG } from '../models/index';

@Injectable()
export class ShellService {

    private _config$: BehaviorSubject<ShellConfig>;
    private _rightnavState$: BehaviorSubject<RightnavState>;
    private _rightnavTitle$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    private _rightnavShowBack$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(@Inject(SHELL_CONFIG) config: ShellConfig) {
        this._config$ = new BehaviorSubject<ShellConfig>(config);
        this._rightnavState$ = new BehaviorSubject<RightnavState>(RightnavState.Help);
    }

    public get config$(): Observable<ShellConfig> {
        return this._config$.asObservable();
    }

    public getConfig(): ShellConfig {
        return this._config$.getValue();
    }

    public setConfig(config: ShellConfig) {
        const cfg = merge(this.getConfig(), config);
        this._config$.next(cfg);
    }

    public setShadows(shadows: {
        top?: boolean,
        left?: boolean,
        right?: boolean
    }) {
        const cfg = merge(this.getConfig(), { shadows: shadows });
        this._config$.next(cfg);
    }

    public get rightnavState$(): Observable<RightnavState> {
        return this._rightnavState$.asObservable();
    }

    public get rightnavState(): RightnavState {
        return this._rightnavState$.getValue();
    }

    public set rightnavState(state: RightnavState) {
        this._rightnavState$.next(state);
    }

    public get rightnavTitle$(): Observable<string> {
        return this._rightnavTitle$.asObservable();
    }

    public get rightnavTitle(): string {
        return this._rightnavTitle$.getValue();
    }

    public set rightnavTitle(title: string) {
        this._rightnavTitle$.next(title);
    }

    public get rightnavShowBack$(): Observable<boolean> {
        return this._rightnavShowBack$.asObservable();
    }

    public get rightnavShowBack(): boolean {
        return this._rightnavShowBack$.getValue();
    }

    public set rightnavShowBack(showBack: boolean) {
        this._rightnavShowBack$.next(showBack);
    }
}
