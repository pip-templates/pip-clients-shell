import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { sitesReducer } from './store/sites.reducer';
import { SitesEffects } from './store/sites.effects';
import { SitesDataService } from './services/sites.data.service';
import { SitesService } from './services/sites.service';

@NgModule({
  imports: [
    // Angular and vendors
    CommonModule,
    StoreModule.forFeature('sites', sitesReducer),
    EffectsModule.forFeature([SitesEffects]),
  ],
  providers: [
    SitesDataService,
    SitesService
  ]
})
export class SitesModule {}
