import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AnotherPageComponent } from './another-page.component';

@NgModule({
  declarations: [AnotherPageComponent],
  imports: [
    // Angular and vendors
    CommonModule,
    RouterModule,
  ]
})
export class AnotherPageModule { }
