import { fromJS } from 'immutable';

import { SitesActionType, SitesAction } from './sites.actions';
import { SitesState } from './sites.state';
import { Site } from '../models/index';
import { EntityState } from '../../../common/index';

export const sitesInitialState: SitesState = {
    sites: [],
    current: null,
    state: EntityState.Empty,
    error: null,
};

export function sitesReducer(
    state: SitesState = sitesInitialState,
    action: SitesAction
): SitesState {
    switch (action.type) {
        case SitesActionType.SitesInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            map = map.set('error', null);
            return <SitesState>map.toJS();
        }

        case SitesActionType.SitesAbort: {
            let map = fromJS(state);
            map = map.set('state', state.error
                ? EntityState.Error
                : state.sites && state.sites.length ? EntityState.Data : EntityState.Empty);
            return <SitesState>map.toJS();
        }

        case SitesActionType.SitesSuccess: {
            let map = fromJS(state);
            map = map.set('error', null);
            return <SitesState>map.toJS();
        }

        case SitesActionType.SitesFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload);
            return <SitesState>map.toJS();
        }

        case SitesActionType.SitesData: {
            let map = fromJS(state);
            map = map.set('sites', action.payload);
            map = map.set('state', EntityState.Data);
            map = map.set('error', null);
            return <SitesState>map.toJS();
        }

        case SitesActionType.SitesEmpty: {
            let map = fromJS(state);
            map = map.set('sites', []);
            map = map.set('state', EntityState.Empty);
            map = map.set('error', null);
            return <SitesState>map.toJS();
        }

        case SitesActionType.SitesCurrent: {
            let map = fromJS(state);
            map = map.set('current', action.payload);
            return <SitesState>map.toJS();
        }

        case SitesActionType.SitesCurrentChangeInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            return <SitesState>map.toJS();
        }

        case SitesActionType.SitesCurrentChangeAbort: {
            let map = fromJS(state);
            map = map.set('state', state.error || !state.current ? EntityState.Error : EntityState.Data);
            return <SitesState>map.toJS();
        }

        case SitesActionType.SitesCurrentChangeSuccess: {
            let map = fromJS(state);
            map = map.set('current', action.payload);
            map = map.set('state', EntityState.Data);
            map = map.set('error', null);
            return <SitesState>map.toJS();
        }

        case SitesActionType.SitesCurrentChangeFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload);
            return <SitesState>map.toJS();
        }

        case SitesActionType.SitesCreateInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            map = map.set('error', null);
            return <SitesState>map.toJS();
        }

        case SitesActionType.SitesCreateAbort: {
            let map = fromJS(state);
            map = map.set('state', state.error
                ? EntityState.Error
                : state.sites && state.sites.length ? EntityState.Data : EntityState.Empty);
            return <SitesState>map.toJS();
        }

        case SitesActionType.SitesCreateSuccess: {
            let map = fromJS(state);
            const sites = map.get('sites').toJS();
            sites.push(action.payload);
            map = map.set('sites', sites);
            map = map.set('state', EntityState.Data);
            map = map.set('error', null);
            return <SitesState>map.toJS();
        }

        case SitesActionType.SitesCreateFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload);
            return <SitesState>map.toJS();
        }

        case SitesActionType.SitesConnectInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            return <SitesState>map.toJS();
        }

        case SitesActionType.SitesConnectSuccess: {
            let map = fromJS(state);
            const sites = map.get('sites').toJS();
            sites.push(action.payload);
            map = map.set('sites', sites);
            map = map.set('state', EntityState.Data);
            map = map.set('error', null);
            return <SitesState>map.toJS();
        }

        case SitesActionType.SitesConnectFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload);
            return <SitesState>map.toJS();
        }

        case SitesActionType.SitesDisconnectInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            return <SitesState>map.toJS();
        }

        case SitesActionType.SitesDisconnectSuccess: {
            let map = fromJS(state);
            const sites = map.get('sites').toJS().filter((site: Site) => site.id !== action.payload.id);
            map = map.set('sites', sites);
            map = map.set('state', EntityState.Data);
            map = map.set('error', null);
            return <SitesState>map.toJS();
        }

        case SitesActionType.SitesDisconnectFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload);
            return <SitesState>map.toJS();
        }

        default: {
            return state;
        }
    }
}
