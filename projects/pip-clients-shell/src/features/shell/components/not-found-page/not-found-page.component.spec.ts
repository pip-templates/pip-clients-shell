import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { NotFoundPagePageComponent } from './not-found-page.component';
import { NotFoundPageModule } from './not-found-page.module';
import { SESSION_CONFIG, defaultSessionConfig } from '../../../session/index';
import { WINDOW_PROVIDERS } from '../../../../common/services/window.service';

describe('NotFoundPageComponent', () => {
    let component: NotFoundPagePageComponent;
    let fixture: ComponentFixture<NotFoundPagePageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NotFoundPageModule,
                RouterModule.forRoot([]),
                TranslateModule.forRoot()
            ],
            providers: [
                {
                    provide: SESSION_CONFIG,
                    useValue: defaultSessionConfig
                },
                WINDOW_PROVIDERS
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NotFoundPagePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
