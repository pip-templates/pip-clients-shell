import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { settingsReducer } from './store/settings.reducer';
import { SettingsEffects } from './store/settings.effects';
import { SettingsDataService } from './services/settings.data.service';
import { SettingsService } from './services/settings.service';

@NgModule({
  imports: [
    // Angular and vendors
    CommonModule,
    StoreModule.forFeature('settings', settingsReducer),
    EffectsModule.forFeature([SettingsEffects]),
  ],
  declarations: [],
  providers: [
    SettingsDataService,
    SettingsService
  ]
})
export class SettingsModule { }
