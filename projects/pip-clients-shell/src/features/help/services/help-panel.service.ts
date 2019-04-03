import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { HelpPanelState, HelpArticle, HelpTopic } from '../models/index';
import { ShellService } from '../../shell/services/shell.service';

@Injectable()
export class HelpPanelService {

    private _defaultTitle = 'HELP_PANEL_TITLE';
    private _searchTitle = 'HELP_PANEL_TITLE_SEARCH';

    private _state$ = new BehaviorSubject<HelpPanelState>(HelpPanelState.Topics);
    private _currentTopic$ = new BehaviorSubject<HelpTopic>(null);
    private _currentArticle$ = new BehaviorSubject<HelpArticle>(null);

    constructor(
        private shell: ShellService
    ) { }

    public setDefaultTitle(): void {
        this.shell.rightnavTitle = this._defaultTitle;
    }

    public setSearchTitle(): void {
        this.shell.rightnavTitle = this._searchTitle;
    }

    public goBack() {
        switch (this.state) {
            case HelpPanelState.Article:
                if (this.currentTopic === null) {
                    this.state = HelpPanelState.Search;
                } else {
                    this.currentArticle = null;
                }
                break;
            case HelpPanelState.Articles:
                this.currentTopic = null;
                break;
            case HelpPanelState.Search:
                this.state = HelpPanelState.Topics;
                break;
        }
    }

    public get state$(): Observable<HelpPanelState> {
        return this._state$.asObservable();
    }

    public get state(): HelpPanelState {
        return this._state$.getValue();
    }

    public set state(val: HelpPanelState) {
        this._state$.next(val);
        switch (val) {
            case HelpPanelState.Topics:
                this.setDefaultTitle();
                this.shell.rightnavShowBack = false;
                break;
            case HelpPanelState.Articles:
                this.shell.rightnavTitle = this.currentTopic ? this.currentTopic.title : this._defaultTitle;
                this.shell.rightnavShowBack = true;
                break;
            case HelpPanelState.Article:
                this.shell.rightnavTitle = this.currentArticle ? this.currentArticle.title : this._defaultTitle;
                this.shell.rightnavShowBack = true;
                break;
            case HelpPanelState.Search:
                this.shell.rightnavTitle = this._searchTitle;
                this.shell.rightnavShowBack = true;
                break;
        }
    }

    public get currentTopic$(): Observable<HelpTopic> {
        return this._currentTopic$.asObservable();
    }

    public get currentTopic(): HelpTopic {
        return this._currentTopic$.getValue();
    }

    public set currentTopic(val: HelpTopic) {
        this._currentTopic$.next(val);
        this._currentArticle$.next(null);
        this.state = val ? HelpPanelState.Articles : HelpPanelState.Topics;
    }

    public get currentArticle$(): Observable<HelpArticle> {
        return this._currentArticle$.asObservable();
    }

    public get currentArticle(): HelpArticle {
        return this._currentArticle$.getValue();
    }

    public set currentArticle(val: HelpArticle) {
        this._currentArticle$.next(val);
        this.state = val ? HelpPanelState.Article : HelpPanelState.Articles;
    }
}
