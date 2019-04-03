import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import { ApplicationTile } from './ApplicationTile';

export class ApplicationGroup {
    public name: string;
    public applications: ApplicationTile[];
    public isHidden?: boolean;

    public findApplicationById(id: string) {
        return this.applications ? find(this.applications, ['id', id]) : null;
    }

    public findApplicationIndexById(id: string) {
        return this.applications ? findIndex(this.applications, ['id', id]) : null;
    }
}
