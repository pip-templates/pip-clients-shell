import { Injectable, Inject } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

import * as utils from './utility';
import { SessionConfig, SESSION_CONFIG } from '../features/session/models/SessionConfig';
import { WINDOW, WindowWrapper } from '../common/services/window.service';

import { MOCK_DATA_VERSION, resetToCurrentDefault } from './storage';

@Injectable()
export class MockInitService {

    constructor(
        private localStorage: LocalStorageService,
        @Inject(SESSION_CONFIG) private config: SessionConfig,
        @Inject(WINDOW) private window: WindowWrapper
    ) { }

    init(): Promise<any> {
        return new Promise((resolve, reject) => {
            const dv = this.localStorage.get('dataVersion');
            if (dv !== MOCK_DATA_VERSION) {
                resetToCurrentDefault();
            }
            this.localStorage.set('dataVersion', MOCK_DATA_VERSION);
            const user = utils.users.find('test');
            const existing = this.localStorage.get(this.config.lsSessionKey);
            if (!existing && this.window.location.href.startsWith('http://localhost')) {
                this.localStorage.set(this.config.lsSessionKey, utils.sessions.create(user));
            }
            resolve();
        });
    }
}
