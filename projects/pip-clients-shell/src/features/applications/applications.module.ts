import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { applicationsReducer } from './store/applications.reducer';
import { ApplicationsEffects } from './store/applications.effects';
import { ApplicationsDataService } from './services/applications.data.service';
import { ApplicationsService } from './services/applications.service';
import { SettingsModule } from '../settings/index';

@NgModule({
    imports: [
        // Angular and vendors
        CommonModule,
        StoreModule.forFeature('applications', applicationsReducer),
        EffectsModule.forFeature([ApplicationsEffects]),
        // pip-clients
        SettingsModule
    ],
    declarations: [],
    providers: [
        ApplicationsDataService,
        ApplicationsService
    ]
})
export class ApplicationsModule { }
