import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { PipMediaModule } from 'pip-webui2-layouts';

import { ExamplePageComponent } from './example-page.component';

@NgModule({
  declarations: [ExamplePageComponent],
  imports: [
    // Angular and vendors
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    RouterModule,
    PipMediaModule
  ]
})
export class ExamplePageModule { }
