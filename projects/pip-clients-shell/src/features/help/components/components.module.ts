import { NgModule } from '@angular/core';

import { HelpListModule } from './help-list/help-list.module';

@NgModule({
  imports: [
    // application modules
    HelpListModule
  ],
  exports: [HelpListModule]
})
export class HelpPanelComponentsModule { }
