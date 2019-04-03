import { InjectionToken } from '@angular/core';

export class SessionConfig {
    public autorizedUrl: string;
    public unautorizedUrl: string;
    public serverUrl: string;
    public lsSessionKey: string;
}

export const SESSION_CONFIG = new InjectionToken<SessionConfig>('Session Config');

export const defaultSessionConfig: SessionConfig = <SessionConfig>{
    autorizedUrl: '/home/index.html',
    unautorizedUrl: '/entry/index.html#/signin',
    serverUrl: '/',
    lsSessionKey: 'session'
};
