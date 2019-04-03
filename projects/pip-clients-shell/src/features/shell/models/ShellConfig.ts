import { InjectionToken } from '@angular/core';

export class ShellConfig {
    shadows?: {
        top?: boolean,
        left?: boolean,
        right?: boolean
    };
}

export const SHELL_CONFIG = new InjectionToken<ShellConfig>('ShellConfig');

export const defaultShellConfig = <ShellConfig>{
    shadows: {
        top: true,
        left: true,
        right: true
    }
};
