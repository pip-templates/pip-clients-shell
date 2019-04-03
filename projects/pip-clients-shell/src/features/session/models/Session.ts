export class Session {
    public id: string;
    public user_id: string;
    public user_name: string;

    /* Session info */
    public active: boolean;
    public open_time: Date;
    public close_time: Date;
    public request_time: Date;
    public address: string;
    public client: string;

    /* Cached content */
    public user: any;
    public data: any;
}
