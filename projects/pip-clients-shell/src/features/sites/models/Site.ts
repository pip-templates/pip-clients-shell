export const enum SitesIndustry {
    Mining = 'Mining',
    Quarries = 'Quarries',
    Oil = 'Oil & Gas',
    Civil = 'Civil and Industrial Construction',
    Road = 'Road Construction',
    Tourism = 'Tourism & Recreation',
    Other = 'Other'
}

export class Site {
    public id: string;
    public code?: string;
    public create_time: Date;
    public creator_id: string;
    public deleted?: boolean;
    public active: boolean;
    public version?: number;

    public name: string;
    public description?: string;
    public address?: string;

    public center?: any; // GeoJSON
    public radius?: number; // In km
    public geometry?: any; // GeoJSON
    public boundaries?: any; // GeoJSON
    public language?: string;
    public timezone?: string;
    public industry?: SitesIndustry;
    public org_size?: number;
    public total_sites?: number;
    public purpose?: string;
    public active_int?: number; // In seconds
    public inactive_int?: number; // In seconds
    public offsite_int?: number; // In seconds
    public offline_timeout?: number; // In seconds
    public data_rate?: number;
    public params?: any;

    public map_id?: string; // Blob id with map background
    public map_north?: number;
    public map_south?: number;
    public map_west?: number;
    public map_east?: number;
}
