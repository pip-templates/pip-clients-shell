import { MultiString } from '../../../common/index';

export class Application {
    public id: string;
    public name: MultiString;
    public description?: MultiString;
    public product: string;
    public group?: string;
    public copyrights?: string;
    public url?: string;
    public icon?: string;
    public min_ver?: number;
    public max_ver?: number;
}
