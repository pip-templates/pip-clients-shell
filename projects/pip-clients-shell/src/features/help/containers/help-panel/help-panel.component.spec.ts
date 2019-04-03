import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipHelpPanelComponent } from './help-panel.component';

describe('HelpPanelComponent', () => {
    let component: PipHelpPanelComponent;
    let fixture: ComponentFixture<PipHelpPanelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PipHelpPanelComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PipHelpPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // it('should create', () => {
    //     expect(component).toBeTruthy();
    // });
});
