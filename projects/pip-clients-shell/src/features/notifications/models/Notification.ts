export class Notification {
    label: string;
    object: {
        name: string,
        type: string
    };
    date: Date;
    info: string;
    icon?: {
        name: string,
        color?: string
    };
}
