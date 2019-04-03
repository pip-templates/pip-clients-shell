import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import merge from 'lodash/merge';
import random from 'lodash/random';
import sample from 'lodash/sample';
import sampleSize from 'lodash/sampleSize';
import * as moment_ from 'moment';

import { Application } from '../features/applications/models/index';
import { User, Session } from '../features/session/models/index';
import { Site } from '../features/sites/models/index';
import {
    applications as storedApplications,
    sessions as storedSessions,
    sites as storedSites,
    users as storedUsers,
    userSites as storedUserSites
} from './storage';

let lastUserId = storedUsers.length ? Number(storedUsers[storedUsers.length - 1].id) : 0;
let lastSessionId = storedSessions.length ? Number(storedSessions[storedSessions.length - 1].id) : 0;
let lastSiteId = storedSites.length ? Number(storedSites[storedSites.length - 1].id) : 0;
const moment = moment_;

export const applications = {
    find: (id: string): Application => {
        return find(storedApplications, ['id', id]);
    },
    create: (app: Application): Application => {
        if (applications.find(app.id)) { return null; }
        storedApplications.push(app);
        localStorage.setItem('mockApplications', JSON.stringify(storedApplications));
        return app;
    },
    update: (app: Application): Application => {
        const idx = findIndex(storedApplications, ['id', app.id]);
        if (idx < 0) { return null; }
        storedApplications[idx] = app;
        localStorage.setItem('mockApplications', JSON.stringify(storedApplications));
        return app;
    },
    delete: (app: Application | string): boolean => {
        const aid = typeof app === 'string' ? app : app.id;
        const idx = findIndex(storedApplications, ['id', aid]);
        if (idx < 0) { return false; }
        storedApplications.splice(idx, 1);
        localStorage.setItem('mockApplications', JSON.stringify(storedApplications));
        return true;
    }
};

export const users = {
    find: (login: string): User | null => {
        let user: User = find(storedUsers, ['login', login]);
        if (!user) {
            user = find(storedUsers, ['email', login]);
        }
        if (!user) {
            user = find(storedUsers, ['id', login]);
        }
        return user;
    },
    create: (user: User): User => {
        lastUserId++;
        user.id = lastUserId.toString().padStart(32, '0');
        userSites.initForUser(user.id);
        user.theme = user.theme || 'pip-light-theme';
        user.language = user.language || 'en';
        if (!user.settings) { user.settings = {}; }
        if (!user.settings['menu_mode']) { user.settings['menu_mode'] = 'all'; }
        if (!user.settings['site_id']) { user.settings['site_id'] = sample(userSites.find(user.id)).id; }
        storedUsers.push(user);
        localStorage.setItem('mockUsers', JSON.stringify(storedUsers));
        const ret: User = cloneDeep(user);
        delete ret.password;
        return ret;
    },
    update: (id: string, user: User): User | null => {
        const idx = findIndex(storedUsers, ['id', id]);
        if (idx < 0) { return null; }
        const userToSave = cloneDeep(user);
        delete userToSave.id;
        storedUsers[idx] = merge({}, storedUsers[idx], userToSave);
        localStorage.setItem('mockUsers', JSON.stringify(storedUsers));
        const ret: User = cloneDeep(storedUsers[idx]);
        delete ret.password;
        return ret;
    },
    delete: (login: string | User): User | null => {
        const l = typeof login === 'string' ? login : login.login;
        const user = users.find(l);
        if (!l) { return null; }
        const idx = findIndex(storedUsers, ['id', user.id]);
        if (idx < 0) { return null; }
        const ret = storedUsers.splice(idx, 1)[0];
        localStorage.setItem('mockUsers', JSON.stringify(storedUsers));
        delete ret.password;
        return ret;
    }
};

export const sessions = {
    find: (session_id: string): Session | null => {
        return find(storedSessions, ['id', session_id]);
    },
    findByUser: (user_id: string): Session[] => {
        return storedSessions.filter(s => s.user_id === user_id);
    },
    create: (user: User): Session => {
        lastSessionId++;
        const s: Session = {
            'user_id': user.id,
            'user_name': user.name,
            'address': '109.254.254.40',
            'client': 'chrome',
            'user': {
                'change_pwd_time': null,
                'settings': user.settings || {},
                'sites': [
                    {
                        'id': '00000000000000000000000000000000',
                        'name': 'Mock site'
                    }
                ],
                'roles': [
                    '00000000000000000000000000000000:admin',
                    'admin'
                ],
                'theme': 'iqt-main',
                'language': 'en',
                'time_zone': null,
                'create_time': new Date(),
                'login': user.login,
                'name': user.name,
                'id': user.id
            },
            'data': null,
            'request_time': new Date(),
            'open_time': new Date(),
            'close_time': null,
            'active': true,
            'id': lastSessionId.toString().padStart(32, '0')
        };
        storedSessions.push(s);
        localStorage.setItem('mockSessions', JSON.stringify(storedSessions));
        return s;
    },
    createClosed: (user: User): Session => {
        lastSessionId++;
        const s: Session = {
            'user_id': user.id,
            'user_name': user.name,
            'address': '109.254.254.40',
            'client': 'chrome',
            'user': {
                'change_pwd_time': null,
                'settings': user.settings || {},
                'sites': [
                    {
                        'id': '00000000000000000000000000000000',
                        'name': 'Mock site'
                    }
                ],
                'roles': [
                    '00000000000000000000000000000000:admin',
                    'admin'
                ],
                'theme': 'iqt-main',
                'language': 'en',
                'time_zone': null,
                'create_time': new Date(),
                'login': user.login,
                'name': user.name,
                'id': user.id
            },
            'data': null,
            'request_time': new Date(),
            'open_time': moment().subtract(2, 'd').toDate(),
            'close_time': moment().subtract(1, 'd').toDate(),
            'active': false,
            'id': lastSessionId.toString().padStart(32, '0')
        };
        storedSessions.push(s);
        localStorage.setItem('mockSessions', JSON.stringify(storedSessions));
        return s;
    },
    close: (session_id: string): boolean => {
        const idx = findIndex(storedSessions, ['id', session_id]);
        if (idx < 0) { return false; }
        storedSessions[idx].active = false;
        storedSessions[idx].close_time = new Date();
        localStorage.setItem('mockSessions', JSON.stringify(storedSessions));
        return true;
    },
    closeAll: (user_id: string): number => {
        const userActiveSessions = sessions.findByUser(user_id).filter(s => s.active);
        for (let idx = 0; idx < userActiveSessions.length; idx++) {
            userActiveSessions[idx].active = false;
            userActiveSessions[idx].close_time = new Date();
        }
        localStorage.setItem('mockSessions', JSON.stringify(storedSessions));
        return userActiveSessions.length;
    }
};

export const sites = {
    find: (predicate: string): Site[] => {
        const rx = new RegExp(predicate, 'i');
        return storedSites.filter(site => site.name.match(rx) || site.code.match(rx));
    },
    create: (site: Site, creator: User): Site => {
        if (site.id) { delete site.id; }
        lastSiteId++;
        site.id = lastSiteId.toString().padStart(32, '0');
        site.code = Array(8).fill(0).map(x => Math.random().toString(36).charAt(2)).join('');
        site.create_time = new Date();
        site.creator_id = creator.id;
        storedSites.push(site);
        localStorage.setItem('mockSites', JSON.stringify(storedSites));
        return site;
    }
};

export const userSites = {
    initForUser: (user_id: string) => {
        storedUserSites.push({
            user_id: user_id,
            site_ids: sampleSize(storedSites, random(1, storedSites.length - 1)).map((site: Site) => site.id)
        });
        localStorage.setItem('mockUserSites', JSON.stringify(storedUserSites));
    },
    collectSites: (site_ids: string[]): Site[] => {
        const s = [];
        for (const site_id of site_ids) {
            const site = find(storedSites, ['id', site_id]);
            if (site) {
                s.push(site);
            }
        }
        return s;
    },
    find: (user_id: string): Site[] => {
        let idx = findIndex(storedUserSites, ['user_id', user_id]);
        if (idx < 0) {
            userSites.initForUser(user_id);
            idx = storedUserSites.length - 1;
        }
        return userSites.collectSites(storedUserSites[idx].site_ids);
    },
    connect: (user_id: string, site_id: string): Site | number => {
        let idx = findIndex(storedUserSites, ['user_id', user_id]);
        if (idx < 0) {
            userSites.initForUser(user_id);
            idx = storedUserSites.length - 1;
        }
        const site = find(storedSites, ['id', site_id]);
        if (!site) { return 1; }
        if (storedUserSites[idx].site_ids.includes(site_id)) { return 0; }
        storedUserSites[idx].site_ids.push(site_id);
        localStorage.setItem('mockUserSites', JSON.stringify(storedUserSites));
        return site;
    },
    disconnect: (user_id: string, site_id: string): Site | number => {
        let idx = findIndex(storedUserSites, ['user_id', user_id]);
        if (idx < 0) {
            userSites.initForUser(user_id);
            idx = storedUserSites.length - 1;
        }
        const site = find(storedSites, ['id', site_id]);
        if (!site) { return 1; }
        const sidx = storedUserSites[idx].site_ids.indexOf(site_id);
        if (sidx < 0) { return 0; }
        const user = find(storedUsers, ['id', user_id]);
        if (user && user.settings.site_id === site_id) { return 2; }
        storedUserSites[idx].site_ids.splice(sidx, 1);
        localStorage.setItem('mockUserSites', JSON.stringify(storedUserSites));
        return site;
    },
};
