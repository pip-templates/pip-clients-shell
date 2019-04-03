import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'pip-clients-shell';

import { AnotherPageComponent } from './another-page/another-page.component';
import { ExamplePageComponent } from './example-page/example-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'example', pathMatch: 'full'},
  { path: 'example', component: ExamplePageComponent, canActivate: [AuthGuard] },
  { path: 'another', component: AnotherPageComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
