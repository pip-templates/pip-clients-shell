import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { SessionConfig, SESSION_CONFIG } from '../models/SessionConfig';
import { SessionService } from '../services/session.service';
import { WINDOW, WindowWrapper } from '../../../common/services/window.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(SESSION_CONFIG) private config: SessionConfig,
    @Inject(WINDOW) private window: WindowWrapper,
    private sessionService: SessionService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.verifySession(state.url);
  }

  verifySession(url: string): boolean {
    if (this.sessionService.session && this.sessionService.session.id) { return true; }

    // Navigate to the login page with extras
    this.window.location.href = this.window.location.origin + this.config.unautorizedUrl;
    return false;
  }
}
