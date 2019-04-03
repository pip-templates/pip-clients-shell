import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import sample from 'lodash/sample';

import * as fromSitesActions from './sites.actions';
import { sitesReducer, sitesInitialState } from './sites.reducer';
import { SitesState } from './sites.state';
import { EntityState } from '../../../common/models/index';
import { sites } from '../../../mock/index';

describe('[Sites] store/reducer', () => {

    let state: SitesState;

    beforeEach(() => {
        state = cloneDeep(sitesInitialState);
    });

    it('should have initial state', () => {
        expect(sitesReducer(undefined, { type: null })).toEqual(sitesInitialState);
        expect(sitesReducer(sitesInitialState, { type: null })).toEqual(sitesInitialState);
    });

    it('should reduce sites states', () => {
        expect(sitesReducer(state,
            new fromSitesActions.SitesInitAction()))
            .toEqual(merge(cloneDeep(state), { error: null, state: EntityState.Progress }));
        expect(sitesReducer(merge(cloneDeep(state), { error: 'error' }),
            new fromSitesActions.SitesAbortAction()))
            .toEqual(merge(cloneDeep(state), { error: 'error', state: EntityState.Error }));
        expect(sitesReducer(merge(cloneDeep(state), { sites: sites }),
            new fromSitesActions.SitesAbortAction()))
            .toEqual(merge(cloneDeep(state), { sites: sites, state: EntityState.Data }));
        expect(sitesReducer(merge(cloneDeep(state), { sites: [] }),
            new fromSitesActions.SitesAbortAction()))
            .toEqual(merge(cloneDeep(state), { sites: [], state: EntityState.Empty }));
        expect(sitesReducer(merge(cloneDeep(state), { error: 'error' }),
            new fromSitesActions.SitesSuccessAction(sites)))
            .toEqual(merge(cloneDeep(state), { error: null }));
        expect(sitesReducer(merge(cloneDeep(state), { error: 'error' }),
            new fromSitesActions.SitesFailureAction('error')))
            .toEqual(merge(cloneDeep(state), { error: 'error', state: EntityState.Error }));
        expect(sitesReducer(merge(cloneDeep(state), { error: 'error' }),
            new fromSitesActions.SitesDataAction(sites)))
            .toEqual(merge(cloneDeep(state), { error: null, state: EntityState.Data, sites: sites }));
        expect(sitesReducer(merge(cloneDeep(state), { sites: sites }),
            new fromSitesActions.SitesEmptyAction()))
            .toEqual(merge(cloneDeep(state), { error: null, state: EntityState.Empty, sites: [] }));
    });

    it('should reduce current site states', () => {
        expect(sitesReducer(state,
            new fromSitesActions.SitesCurrentAction(sites[0])))
            .toEqual(merge(cloneDeep(state), { current: sites[0] }));
        expect(sitesReducer(state,
            new fromSitesActions.SitesCurrentChangeInitAction(sites[0])))
            .toEqual(merge(cloneDeep(state), { state: EntityState.Progress }));
        expect(sitesReducer(merge(cloneDeep(state), { error: 'error' }),
            new fromSitesActions.SitesCurrentChangeAbortAction()))
            .toEqual(merge(cloneDeep(state), { state: EntityState.Error, error: 'error' }));
        expect(sitesReducer(state,
            new fromSitesActions.SitesCurrentChangeAbortAction()))
            .toEqual(merge(cloneDeep(state), { state: EntityState.Error }));
        expect(sitesReducer(merge(cloneDeep(state), { current: sites[0] }),
            new fromSitesActions.SitesCurrentChangeAbortAction()))
            .toEqual(merge(cloneDeep(state), { current: sites[0], state: EntityState.Data }));
        expect(sitesReducer(merge(cloneDeep(state), { current: sites[1], error: 'error' }),
            new fromSitesActions.SitesCurrentChangeSuccessAction(sites[0])))
            .toEqual(merge(cloneDeep(state), { current: sites[0], state: EntityState.Data, error: null }));
        expect(sitesReducer(state,
            new fromSitesActions.SitesCurrentChangeFailureAction('error')))
            .toEqual(merge(cloneDeep(state), { state: EntityState.Error, error: 'error' }));
    });

    it('should reduce create site states', () => {
        const joc = jasmine.objectContaining;
        const newSite = sample(sites);
        newSite.name = 'Test site';
        expect(sitesReducer(state,
            new fromSitesActions.SitesCreateInitAction(newSite)))
            .toEqual(joc({ state: EntityState.Progress, error: null }));
        expect(sitesReducer(merge(cloneDeep(state), { error: 'error' }),
            new fromSitesActions.SitesCreateAbortAction()))
            .toEqual(joc({ state: EntityState.Error }));
        expect(sitesReducer(merge(cloneDeep(state), { sites: sites }),
            new fromSitesActions.SitesCreateAbortAction()))
            .toEqual(joc({ state: EntityState.Data }));
        expect(sitesReducer(state,
            new fromSitesActions.SitesCreateAbortAction()))
            .toEqual(joc({ state: EntityState.Empty }));
        expect(sitesReducer(state,
            new fromSitesActions.SitesCreateSuccessAction(newSite)))
            .toEqual(joc({ state: EntityState.Data, error: null, sites: [newSite] }));
        expect(sitesReducer(state,
            new fromSitesActions.SitesCreateFailureAction('error')))
            .toEqual(joc({ state: EntityState.Error, error: 'error' }));
    });

    it('should reduce connect and diconnect site states', () => {
        const site = sample(sites);
        const joc = jasmine.objectContaining;
        const stateWithSite = merge(cloneDeep(state), { sites: [site] });
        expect(sitesReducer(
            state,
            new fromSitesActions.SitesConnectInitAction(site)
        )).toEqual(joc({ state: EntityState.Progress }));
        expect(sitesReducer(
            state,
            new fromSitesActions.SitesConnectSuccessAction(site)
        )).toEqual(joc({ sites: [site] }));
        expect(sitesReducer(
            state,
            new fromSitesActions.SitesConnectFailureAction('error')
        )).toEqual(joc({ state: EntityState.Error, error: 'error' }));

        expect(sitesReducer(
            stateWithSite,
            new fromSitesActions.SitesDisconnectInitAction(site)
        )).toEqual(joc({ state: EntityState.Progress }));
        expect(sitesReducer(
            stateWithSite,
            new fromSitesActions.SitesDisconnectSuccessAction(site)
        )).toEqual(joc({ sites: [] }));
        expect(sitesReducer(
            stateWithSite,
            new fromSitesActions.SitesDisconnectFailureAction('error')
        )).toEqual(joc({ state: EntityState.Error, error: 'error' }));
    });

});
