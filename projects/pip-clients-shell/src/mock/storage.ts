import * as moment_ from 'moment';

import { Application } from '../features/applications/models/Application';
import { Notification } from '../features/notifications/models/Notification';
import { User, Session } from '../features/session/models/index';
import { Site } from '../features/sites/models/Site';

const moment = moment_;

interface UserSites {
    user_id: string; site_ids: string[];
}

export const MOCK_DATA_VERSION = 6;

const usersDefault: User[] = [
    {
        id: '00000000000000000000000000000000',
        login: 'test',
        email: 'test@mail.com',
        name: 'Test user',
        password: 'A1b2c3',
        settings: {
            'menu_mode': 'all',
            'key1': 'value1',
            'key2': 'value2',
            'site_id': '00000000000000000000000000000000',
            'favourites_00000000000000000000000000000000': '[\"pip_devices\", \"pip_sensor_interface\"]',
        },
        language: 'en',
        theme: 'pip-light-theme'
    }
];
const sitesDefault: Site[] = [
    {
        id: '00000000000000000000000000000000',
        create_time: new Date(),
        creator_id: '00000000000000000000000000000000',
        active: true,
        name: 'Mock site',
        code: 'MOx0001',
        description: 'First site for mocking purposes',
        address: 'Tuscon, USA'
    },
    {
        id: '00000000000000000000000000000001',
        create_time: new Date(),
        creator_id: '00000000000000000000000000000000',
        active: true,
        name: 'Mock site #2',
        code: 'FXMO_NI',
        description: 'This site looks similar to first',
        address: 'Canberra, Australia'
    },
    {
        id: '00000000000000000000000000000002',
        create_time: new Date(),
        creator_id: '00000000000000000000000000000000',
        active: true,
        name: 'Mock site #3',
        code: 'ms_the_third',
        description: 'Local copy of Google',
        address: 'Reykjavík, Iceland'
    },
    {
        id: '00000000000000000000000000000003',
        create_time: new Date(),
        creator_id: '00000000000000000000000000000000',
        active: true,
        name: 'Mock site #4',
        code: 'IDDQD',
        description: 'Unseen University site',
        address: 'Novosibirsk, Russia'
    },
];
const userSitesDefault: UserSites[] = [
    {
        user_id: '00000000000000000000000000000000',
        site_ids: [
            '00000000000000000000000000000000',
            '00000000000000000000000000000001',
            '00000000000000000000000000000002'
        ]
    }
];
const applicationsDefault: Application[] = [
    {
        'name': {
            'ru': 'OEM интерфейсы',
            'en': 'OEM Interfaces'
        },
        'description': {
            'ru': 'описание',
            'en': 'description'
        },
        'product': 'PIP',
        'group': 'administration',
        'url': '/oemi/index.html#',
        'icon': 'description',
        'id': 'pip_oem_interfaces'
    },
    {
        'name': {
            'ru': 'Пользователи',
            'en': 'Users'
        },
        'description': {
            'ru': 'описание',
            'en': 'description'
        },
        'product': 'PIP',
        'group': 'administration',
        'url': '/users/index.html#',
        'icon': 'description',
        'id': 'pip_users'
    },
    {
        'name': {
            'ru': 'Профили данных',
            'en': 'Data profiles'
        },
        'description': {
            'ru': 'описание',
            'en': 'description'
        },
        'product': 'PIP',
        'group': 'administration',
        'url': '/data_profiles/index.html#',
        'icon': 'description',
        'id': 'pip_data_profiles'
    },
    {
        'name': {
            'ru': 'Сенсорные интерфейсы',
            'en': 'Sensor interface'
        },
        'description': {
            'ru': 'описание',
            'en': 'description'
        },
        'product': 'PIP',
        'group': 'administration',
        'url': '/sensor_interface/index.html#',
        'icon': 'description',
        'id': 'pip_sensor_interface'
    },
    {
        'name': {
            'ru': 'Устройства',
            'en': 'Devices'
        },
        'description': {
            'ru': 'описание',
            'en': 'description'
        },
        'product': 'PIP',
        'group': 'config',
        'url': '/devices/index.html#',
        'icon': 'iqt-tracker',
        'id': 'pip_devices'
    },
    {
        'name': {
            'ru': 'Правила сенсорных оповещений',
            'en': 'Sensor alarm rules'
        },
        'description': {
            'ru': 'описание',
            'en': 'description'
        },
        'product': 'PIP',
        'group': 'config',
        'url': '/sensor_alarm_rules/index.html#',
        'icon': 'description',
        'id': 'pip_sensor_alarm_rules'
    },
    {
        'name': {
            'ru': 'Оборудование',
            'en': 'Equipment'
        },
        'description': {
            'ru': 'описание',
            'en': 'description'
        },
        'product': 'PIP',
        'group': 'config',
        'url': '/equipment/index.html#',
        'icon': 'mood_bad',
        'id': 'pip_equipment'
    },
    {
        'name': {
            'ru': 'Персонал',
            'en': 'Personnel'
        },
        'description': {
            'ru': 'описание',
            'en': 'description'
        },
        'product': 'PIP',
        'group': 'config',
        'url': '/usersettings/index.html#',
        'icon': 'description',
        'id': 'pip_usersettings'
    },
    {
        'name': {
            'ru': 'Наблюдение за сенсорами',
            'en': 'Sensor monitoring'
        },
        'description': {
            'ru': 'описание',
            'en': 'description'
        },
        'product': 'PIP',
        'group': 'control',
        'url': '/sensor_monitoring/index.html#',
        'icon': 'description',
        'id': 'pip_sensor_monitoring'
    },
    {
        'name': {
            'ru': 'История оповещений от сенсоров',
            'en': 'Sensor alarm history'
        },
        'description': {
            'ru': 'описание',
            'en': 'description'
        },
        'product': 'PIP',
        'group': 'control',
        'url': '/sensor_alarm_history/index.html#',
        'icon': 'description',
        'id': 'pip_sensor_alarm_history'
    }
];
const notificationsDefault: Notification[] = [
    {
        label: 'High speed',
        object: {
            name: 'T101',
            type: 'Haul truck'
        },
        date: moment().subtract(15, 'm').toDate(),
        info: '55 km/h',
        icon: {
            name: 'error',
            color: 'error'
        }
    },
    {
        label: 'High speed',
        object: {
            name: 'T101',
            type: 'Haul truck'
        },
        date: moment().subtract(37, 'm').toDate(),
        info: '55 km/h',
        icon: {
            name: 'error',
            color: 'error'
        }
    },
    {
        label: 'High engine temperature',
        object: {
            name: 'T101',
            type: 'Haul truck'
        },
        date: moment().subtract(1, 'h').toDate(),
        info: '250 C'
    }
];

export let users: User[] = JSON.parse(localStorage.getItem('mockUsers')) || usersDefault;
export let sites: Site[] = JSON.parse(localStorage.getItem('mockSites')) || sitesDefault;
export let userSites: UserSites[] = JSON.parse(localStorage.getItem('mockUserSites')) || userSitesDefault;
export let sessions: Session[] = JSON.parse(localStorage.getItem('mockSessions')) || [];
export let applications: Application[] = JSON.parse(localStorage.getItem('mockApplications')) || applicationsDefault;
export let notifications: Notification[] = JSON.parse(localStorage.getItem('mockNotifications')) || notificationsDefault;

export function resetToCurrentDefault() {
    localStorage.clear();
    users = usersDefault;
    sites = sitesDefault;
    userSites = userSitesDefault;
    sessions = [];
    applications = applicationsDefault;
    notifications = notificationsDefault;
}
