import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { pipSidenavModule } from './sidenav/sidenav.module';
import { NotFoundPageModule } from './not-found-page/not-found-page.module';

@NgModule({
  imports: [
    CommonModule,
    pipSidenavModule,
    NotFoundPageModule
  ]
})
export class ShellComponentsModule { }
