export function getSidenavTranslations(favouritesGroupName: string) {
    return {
        en: {
            'SiDENAV.SITE.CONNECT': 'Connect to site',
            'SiDENAV.SITE.DISCONNECT': 'Disconnect from site',
            [favouritesGroupName]: 'Favorite',
            'administration': 'Administration',
            'config': 'Configuration',
            'control': 'Control Automation'
        },
        ru: {
            'SiDENAV.SITE.CONNECT': 'Подключиться к сайту',
            'SiDENAV.SITE.DISCONNECT': 'Отключиться от сайта',
            [favouritesGroupName]: 'Избранное',
            'administration': 'Администрирование',
            'config': 'Конфигурации',
            'control': 'Автоматизация управления',
        }
    };
}
