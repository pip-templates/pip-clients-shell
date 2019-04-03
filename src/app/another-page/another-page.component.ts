import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PipNavService } from 'pip-webui2-nav';

import { anotherPageTranslations } from './another-page.strings';

@Component({
  selector: 'pip-another-page',
  templateUrl: './another-page.component.html',
  styleUrls: ['./another-page.component.scss']
})
export class AnotherPageComponent implements OnInit {

  constructor(
    private navService: PipNavService,
    private translate: TranslateService
  ) {
    this.navService.showBreadcrumb({
      items: [{ title: 'title' }]
    });
    this.translate.setTranslation('en', anotherPageTranslations.en, true);
    this.translate.setTranslation('ru', anotherPageTranslations.ru, true);
  }

  ngOnInit() {
  }

}
