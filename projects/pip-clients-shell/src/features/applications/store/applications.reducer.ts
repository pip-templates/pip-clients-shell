import { fromJS } from 'immutable';
import findIndex from 'lodash/findIndex';

import { ApplicationsActionType, ApplicationsAction } from './applications.actions';
import { ApplicationsState } from './applications.state';
import { ApplicationTile, ApplicationGroup } from '../models/index';
import { EntityState } from '../../../common/index';

export const applicationsInitialState: ApplicationsState = {
    applications: [],
    groups: [],
    state: EntityState.Empty,
    toggling: false,
    error: null,
};

function groupApplications(applications: ApplicationTile[], FAVOURITES_GROUP_NAME: string): ApplicationGroup[] {
    const groups = {
        [FAVOURITES_GROUP_NAME]: <ApplicationGroup>{
            name: FAVOURITES_GROUP_NAME,
            applications: [],
            isHidden: false
        }
    };
    for (const app of applications) {
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

export function applicationsReducer(
    state = applicationsInitialState,
    action: ApplicationsAction
): ApplicationsState {
    switch (action.type) {
        case ApplicationsActionType.ApplicationsInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            map = map.set('error', null);
            return <ApplicationsState>map.toJS();
        }

        case ApplicationsActionType.ApplicationsAbort: {
            let map = fromJS(state);
            map = map.set('state', state.error
                ? EntityState.Error
                : state.applications && state.applications.length
                    ? EntityState.Data
                    : EntityState.Empty);
            return <ApplicationsState>map.toJS();
        }

        case ApplicationsActionType.ApplicationsSuccess: {
            let map = fromJS(state);
            map = map.set('error', null);
            return <ApplicationsState>map.toJS();
        }

        case ApplicationsActionType.ApplicationsFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload);
            return <ApplicationsState>map.toJS();
        }

        case ApplicationsActionType.ApplicationsData: {
            let map = fromJS(state);
            map = map.set('applications', action.payload);
            map = map.set('groups', groupApplications(action.payload, action.config.favouritesGroupName));
            map = map.set('state', EntityState.Data);
            return <ApplicationsState>map.toJS();
        }

        case ApplicationsActionType.ApplicationsEmpty: {
            let map = fromJS(state);
            map = map.set('applications', []);
            map = map.set('groups', []);
            map = map.set('state', EntityState.Empty);
            return <ApplicationsState>map.toJS();
        }

        case ApplicationsActionType.ApplicationsToggleFavourite: {
            const idx = findIndex(state.applications, ['id', action.payload.application_id]);
            let map = fromJS(state);
            const applications = map.get('applications').toJS();
            if (idx >= 0) {
                applications[idx].isFavourite = action.payload.state;
            }
            map = map.set('applications', applications);
            map = map.set('groups', groupApplications(applications, action.payload.config.favouritesGroupName));
            map = map.set('state', EntityState.Data);
            map = map.set('toggling', true);
            map = map.set('error', null);
            return <ApplicationsState>map.toJS();
        }

        case ApplicationsActionType.ApplicationsToggleFavouriteSuccess: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Data);
            map = map.set('toggling', false);
            map = map.set('error', null);
            return <ApplicationsState>map.toJS();
        }

        case ApplicationsActionType.ApplicationsToggleFavouriteFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Data);
            map = map.set('toggling', false);
            map = map.set('error', action.payload.error);
            return <ApplicationsState>map.toJS();
        }

        default: {
            return state;
        }
    }
}
