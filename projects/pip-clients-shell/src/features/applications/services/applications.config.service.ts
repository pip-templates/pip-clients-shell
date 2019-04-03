import { Injectable } from '@angular/core';
import merge from 'lodash/merge';

import { ApplicationConfig } from '../models/index';

export const APPLICATION_CONFIG_DEFAULT: ApplicationConfig = {
    favouritesGroupName: 'favourites',
    defaultFavouritesIds: ['pip_devices', 'pip_usersettings']
};

@Injectable({
    providedIn: 'root',
})
export class ApplicationsConfigService {
    private _config: ApplicationConfig;

    // TODO: Actually should be Partial<ApplicationConfig>, but error thrown during compile, research needed
    public constructor(config?: ApplicationConfig) {
        this._config = config ? merge(APPLICATION_CONFIG_DEFAULT, config) : APPLICATION_CONFIG_DEFAULT;
    }

    public get config(): ApplicationConfig {
        return this._config;
    }

    public get favouritesGroupName(): string {
        return this._config.favouritesGroupName;
    }

    public set favouritesGroupName(name: string) {
        if (this._config instanceof ApplicationConfig) {
            this._config.favouritesGroupName = name;
        }
    }
}
