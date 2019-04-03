import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipNotificationPanelComponent } from './notification-panel.component';

describe('NotificationPanelComponent', () => {
    let component: PipNotificationPanelComponent;
    let fixture: ComponentFixture<PipNotificationPanelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PipNotificationPanelComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PipNotificationPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // it('should create', () => {
    //     expect(component).toBeTruthy();
    // });
});
