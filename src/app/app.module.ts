import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { FlexLayoutModule } from '@angular/flex-layout';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ShellModule, ShellContainerComponent } from 'pip-clients-shell';

import { AppRoutingModule } from './app-routing.module';
import { AnotherPageModule } from './another-page/another-page.module';
import { ExamplePageModule } from './example-page/example-page.module';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    // Angular and vendors
    BrowserModule,
    BrowserAnimationsModule,
    // FlexLayoutModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    // pip-clients
    ShellModule.forMock(),
    // application modules
    AnotherPageModule,
    AppRoutingModule,
    ExamplePageModule
  ],
  bootstrap: [ShellContainerComponent]
})
export class AppModule { }
