import { Component, OnInit, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BREAKPOINTS, MediaObserver } from '@angular/flex-layout';
import { ShellService } from 'pip-clients-shell';
import { PipMediaService } from 'pip-webui2-layouts';
import { PipNavService } from 'pip-webui2-nav';

import { examplePageTranslations } from './example-page.strings';

@Component({
  selector: 'pip-example-page',
  templateUrl: './example-page.component.html',
  styleUrls: ['./example-page.component.scss']
})
export class ExamplePageComponent implements OnInit {

  public windowSize: number = window && window.innerWidth;

  constructor(
    @Inject(BREAKPOINTS) public bps: any,
    private navService: PipNavService,
    private translate: TranslateService,
    private shell: ShellService,
    public fxMedia: MediaObserver,
    public media: PipMediaService
  ) {
    this.navService.showBreadcrumb({
      items: [{ title: 'Example' }]
    });

    this.translate.setTranslation('en', examplePageTranslations.en, true);
    this.translate.setTranslation('ru', examplePageTranslations.ru, true);

    window.addEventListener('resize', () => {
      this.windowSize = window.innerWidth;
    });
  }

  ngOnInit() {
  }

  public toggleShadow(side: string) {
    const shadows = this.shell.getConfig().shadows;
    if (shadows.hasOwnProperty(side)) {
      this.shell.setShadows({ [side]: !shadows[side] });
    }
  }
}
