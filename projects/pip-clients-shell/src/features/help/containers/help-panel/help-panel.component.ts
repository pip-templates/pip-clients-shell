import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { helpPanelTranslations } from './help-panel.strings';
import { HelpTopic, HelpArticle, HelpPanelState } from '../../models/index';
import { HelpPanelService } from '../../services/help-panel.service';

@Component({
    selector: 'pip-help-panel',
    templateUrl: './help-panel.component.html',
    styleUrls: ['./help-panel.component.scss']
})
export class PipHelpPanelComponent implements OnDestroy {

    private subs = new Subscription();

    public topics: HelpTopic[] = [
        {
            title: 'Help topic 1',
            articles: [
                { title: 'Help article 1.1', content: `<p>Content <code>equipment</code></p>` },
                { title: 'Help article 1.2', content: `<p>Content <code>master</code></p>` },
                { title: 'Help article 1.3', content: `<p>Content <code>education</code></p>` },
                { title: 'Help article 1.4', content: `<p>Content <code>stamina</code></p>` },
                { title: 'Help article 1.5', content: `<p>Content <code>podcast</code></p>` },
            ]
        },
        {
            title: 'Help topic 2',
            articles: [
                { title: 'Help article 2.1', content: `<p>Content <code>statement</code></p>` },
                { title: 'Help article 2.2', content: `<p>Content <code>force</code></p>` },
                { title: 'Help article 2.3', content: `<p>Content <code>power</code></p>` },
                { title: 'Help article 2.4', content: `<p>Content <code>cart</code></p>` },
                { title: 'Help article 2.5', content: `<p>Content <code>imminent</code></p>` },
            ]
        },
        {
            title: 'Help topic 3',
            articles: [
                { title: 'Help article 3.1', content: `<p>Content <code>star</code></p>` },
                { title: 'Help article 3.2', content: `<p>Content <code>proud</code></p>` },
                { title: 'Help article 3.3', content: `<p>Content <code>control</code></p>` },
                { title: 'Help article 3.4', content: `<p>Content <code>tempest</code></p>` },
                { title: 'Help article 3.5', content: `<p>Content <code>will</code></p>` },
            ]
        },
        {
            title: 'Help topic 4',
            articles: [
                { title: 'Help article 4.1', content: `<p>Content <code>future</code></p>` },
                {
                    title: 'Help article 4.2 (long)',
                    content: Array(40).fill(0).map(() => `<p>Content <code>pronunciation</code></p>`).join('\n')
                },
                { title: 'Help article 4.3', content: `<p>Content <code>Michael Jackson</code></p>` },
                { title: 'Help article 4.4', content: `<p>Content <code>the reason</code></p>` },
                { title: 'Help article 4.5', content: `<p>Content <code>nature</code></p>` },
            ]
        }
    ];
    public searchControl = new FormControl();
    public filteredArticles: HelpArticle[];

    constructor(
        private translate: TranslateService,
        public helpPanelService: HelpPanelService
    ) {
        this.translate.setTranslation('ru', helpPanelTranslations.ru, true);
        this.translate.setTranslation('en', helpPanelTranslations.en, true);

        this.subs.add(this.helpPanelService.state$.subscribe(state => {
            if (state !== HelpPanelState.Search) { this.searchControl.setValue(''); }
        }));

        this.helpPanelService.state = HelpPanelState.Topics;

        this.subs.add(this.searchControl.valueChanges.pipe(
            debounceTime(200),
            distinctUntilChanged()
        ).subscribe(search => {
            if (search && this.helpPanelService.state !== HelpPanelState.Search) {
                this.helpPanelService.state = HelpPanelState.Search;
            } else if (!search && this.helpPanelService.state === HelpPanelState.Search) {
                this.helpPanelService.state = HelpPanelState.Topics;
            }
            if (search) {
                const articles = [];
                for (const topic of this.topics) {
                    for (const article of topic.articles) {
                        if (article.content.match(search)) {
                            articles.push(article);
                        }
                    }
                }
                this.filteredArticles = articles;
            } else {
                this.filteredArticles = [];
            }
        }));
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
        this.helpPanelService.currentTopic = null;
    }

    public selectTopic(topic: HelpTopic) {
        this.helpPanelService.currentTopic = topic;
    }

    public selectArticle(article: HelpArticle) {
        this.helpPanelService.currentArticle = article;
    }

}
