import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import merge from 'lodash/merge';

import * as fromApplicationsActions from './applications.actions';
import { applicationsReducer, applicationsInitialState } from './applications.reducer';
import { ApplicationsState } from './applications.state';
import { ApplicationTile, ApplicationGroup } from '../models/index';
import { EntityState } from '../../../common/models/index';
import { applications } from '../../../mock/index';

function groupApplications(apps: ApplicationTile[], FAVOURITES_GROUP_NAME: string): ApplicationGroup[] {
    const groups = {
        [FAVOURITES_GROUP_NAME]: <ApplicationGroup>{
            name: FAVOURITES_GROUP_NAME,
            applications: [],
            isHidden: false
        }
    };
    for (const app of apps) {
        if (!groups.hasOwnProperty(app.group)) {
            groups[app.group] = <ApplicationGroup>{
                name: app.group,
                applications: []
            };
        }
        groups[app.group].applications.push(app);
        if (app.isFavourite) {
            groups[FAVOURITES_GROUP_NAME].applications.push(app);
        }

    }
    for (const key of Object.keys(groups)) {
        groups[key].isHidden = groups[key].applications.length === 0;
    }
    return Object.keys(groups).map(key => groups[key]);
}

describe('[Applications] store/reducer', () => {

    let apps: ApplicationTile[];
    let state: ApplicationsState;

    beforeEach(() => {
        state = cloneDeep(applicationsInitialState);
        apps = cloneDeep(applications);
    });

    beforeAll(() => {
        localStorage.clear();
    });

    it('should have initial state', () => {
        expect(applicationsReducer(undefined, { type: null })).toEqual(applicationsInitialState);
        expect(applicationsReducer(applicationsInitialState, { type: null })).toEqual(applicationsInitialState);
    });

    it('should reduce applications states', () => {
        apps[0].isFavourite = true;
        const stateWithGroups = merge(cloneDeep(state), {
            applications: apps,
            groups: groupApplications(apps, 'favourites'),
            state: EntityState.Data
        });
        expect(applicationsReducer(state,
            new fromApplicationsActions.ApplicationsInitAction(['pip_devices'],
                { favouritesGroupName: 'favourites', defaultFavouritesIds: [] })))
            .toEqual(merge(cloneDeep(state), { error: null, state: EntityState.Progress }));
        expect(applicationsReducer(merge(cloneDeep(state), { error: 'error' }),
            new fromApplicationsActions.ApplicationsAbortAction()))
            .toEqual(merge(cloneDeep(state), { error: 'error', state: EntityState.Error }));
        expect(applicationsReducer(merge(cloneDeep(state), { applications: apps }),
            new fromApplicationsActions.ApplicationsAbortAction()))
            .toEqual(merge(cloneDeep(state), { applications: apps, state: EntityState.Data }));
        expect(applicationsReducer(merge(cloneDeep(state), { applications: [] }),
            new fromApplicationsActions.ApplicationsAbortAction()))
            .toEqual(merge(cloneDeep(state), { applications: [], state: EntityState.Empty }));
        expect(applicationsReducer(merge(cloneDeep(state), { error: 'error' }),
            new fromApplicationsActions.ApplicationsSuccessAction(apps, { favouritesGroupName: 'favourites', defaultFavouritesIds: [] })))
            .toEqual(merge(cloneDeep(state), { error: null }));
        expect(applicationsReducer(merge(cloneDeep(state), { error: 'error' }),
            new fromApplicationsActions.ApplicationsFailureAction('error')))
            .toEqual(merge(cloneDeep(state), { error: 'error', state: EntityState.Error }));
        expect(applicationsReducer(state,
            new fromApplicationsActions.ApplicationsDataAction(apps, { favouritesGroupName: 'favourites', defaultFavouritesIds: [] })))
            .toEqual(stateWithGroups);
        expect(applicationsReducer(merge(cloneDeep(state), { applications: [] }),
            new fromApplicationsActions.ApplicationsEmptyAction()))
            .toEqual(merge(cloneDeep(state), { error: null, applications: [], groups: [] }));
    });

    it('should reduce applications toogle favorite states', () => {
        const joc = jasmine.objectContaining;
        const stateWithGroups = merge(cloneDeep(state), {
            applications: apps,
            groups: groupApplications(apps, 'favourites'),
            state: EntityState.Data
        });
        const stateWithGroupsAndToggling = merge(cloneDeep(stateWithGroups), {
            toggling: true
        });
        const idx = findIndex(apps, ['id', 'pip_devices']);
        if (idx) {
            apps[idx].isFavourite = true;
        }
        const stateWithFavorite = merge(cloneDeep(state), {
            applications: apps,
            groups: groupApplications(apps, 'favourites'),
            state: EntityState.Data,
            toggling: true
        });
        if (idx) {
            apps[idx].isFavourite = false;
        }
        const stateWithNotFavorite = merge(cloneDeep(state), {
            applications: apps,
            groups: groupApplications(apps, 'favourites'),
            state: EntityState.Data,
            toggling: true
        });
        expect(applicationsReducer(stateWithGroups,
            new fromApplicationsActions.ApplicationsToggleFavouriteAction(
                {
                    application_id: 'pip_devices',
                    state: true,
                    config: { favouritesGroupName: 'favourites', defaultFavouritesIds: [] }
                }
            )))
            .toEqual(stateWithFavorite);
        expect(applicationsReducer(stateWithGroups,
            new fromApplicationsActions.ApplicationsToggleFavouriteAction(
                {
                    application_id: 'unknown',
                    state: true,
                    config: { favouritesGroupName: 'favourites', defaultFavouritesIds: [] }
                }
            )))
            .toEqual(stateWithGroupsAndToggling);
        expect(applicationsReducer(stateWithGroups,
            new fromApplicationsActions.ApplicationsToggleFavouriteAction(
                {
                    application_id: 'pip_devices',
                    state: false,
                    config: { favouritesGroupName: 'favourites', defaultFavouritesIds: [] }
                }
            )))
            .toEqual(stateWithNotFavorite);

        expect(applicationsReducer(stateWithFavorite,
            new fromApplicationsActions.ApplicationsToggleFavouriteSuccessAction()))
            .toEqual(joc({ toggling: false }));
        expect(applicationsReducer(stateWithFavorite,
            new fromApplicationsActions.ApplicationsToggleFavouriteFailureAction(
                {
                    error: 'error',
                    application_id: 'pip_devices',
                    state: true,
                    config: { favouritesGroupName: 'favourites', defaultFavouritesIds: [] }
                }
            )))
            .toEqual(joc({
                toggling: false,
                error: 'error'
            }));
    });

});
