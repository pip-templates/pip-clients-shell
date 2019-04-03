import { Component, OnInit, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { PipNavService } from 'pip-webui2-nav';

import { notFoundPageTranslations } from './not-found-page.strings';
import { SESSION_CONFIG, SessionConfig } from '../../../session/models/SessionConfig';
import { WINDOW, WindowWrapper } from '../../../../common/services/window.service';

@Component({
    selector: 'pip-404-page',
    templateUrl: './not-found-page.component.html',
    styleUrls: ['./not-found-page.component.scss']
})
export class NotFoundPagePageComponent implements OnInit {

    public notFoundActions: any[];

    constructor(
        @Inject(SESSION_CONFIG) private config: SessionConfig,
        @Inject(WINDOW) private window: WindowWrapper,
        private location: Location,
        private navService: PipNavService,
        private translate: TranslateService,
    ) {
        this.navService.showTitle('NOT_FOUND_PAGE_TITLE');

        this.translate.setTranslation('en', notFoundPageTranslations.en, true);
        this.translate.setTranslation('ru', notFoundPageTranslations.ru, true);

        this.notFoundActions = [
            { title: this.translate.instant('NOT_FOUND_PAGE_GO_BACK'), action: () => { this.onBack(); } },
            { title: this.translate.instant('NOT_FOUND_PAGE_GO_HOME'), action: () => { this.onHome(); } },
        ];
    }

    ngOnInit() { }

    private onBack() {
        this.location.back();
    }

    private onHome() {
        this.window.location.href = this.window.location.origin + this.config.autorizedUrl;
    }

}
