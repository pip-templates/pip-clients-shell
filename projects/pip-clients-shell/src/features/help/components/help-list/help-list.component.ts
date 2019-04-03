import { Component, Input, Output, EventEmitter } from '@angular/core';

import { HelpArticle, HelpTopic } from '../../models/index';

@Component({
    selector: 'pip-help-list',
    templateUrl: './help-list.component.html',
    styleUrls: ['./help-list.component.scss']
})
export class HelpListComponent {

    @Input() items: HelpArticle[] | HelpTopic[];

    @Output() select = new EventEmitter<HelpArticle | HelpTopic>();

    constructor() { }

    public onSelect(item: HelpArticle | HelpTopic) {
        this.select.emit(item);
    }

}
