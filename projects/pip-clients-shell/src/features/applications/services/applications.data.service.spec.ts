import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { cloneDeep, sample } from 'lodash';
import { Subscription } from 'rxjs';

import { ApplicationsDataService } from './applications.data.service';
import { Application, ApplicationTile } from '../models/index';
import { SESSION_CONFIG, defaultSessionConfig } from '../../session/index';
import { applications, mockApplicationsProvider } from '../../../mock/index';

describe('[Applications] applications.data.service', () => {

    let service: ApplicationsDataService;
    let subs: Subscription;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule
            ],
            providers: [
                ApplicationsDataService,
                mockApplicationsProvider,
                {
                    provide: SESSION_CONFIG,
                    useValue: defaultSessionConfig
                },
            ],
        })
            .compileComponents();
        service = TestBed.get(ApplicationsDataService);
        subs = new Subscription();
    });


    afterEach(() => { subs.unsubscribe(); });

    afterAll(() => {
        localStorage.removeItem('mockApplications');
    });

    it('should read applications', done => {
        subs.add(service.readApplications().subscribe(apps => {
            expect(apps).toEqual(<ApplicationTile[]>applications);
            done();
        }));
    });

    it('should update application', done => {
        const app: ApplicationTile = cloneDeep(applications[0]);
        app.description = { 'en': 'new description', 'ru': 'russian description' };
        subs.add(service.updateApplication(app).subscribe(updated => {
            expect(updated).toEqual(app);
            done();
        }));
    });

    it('shouldn\'t update not existing application', done => {
        const app: ApplicationTile = cloneDeep(applications[0]);
        app.id = 'bad_id';
        app.description = { 'en': 'new description', 'ru': 'russian description' };
        subs.add(service.updateApplication(app).subscribe(
            () => {},
            (error) => { expect(error.code).toEqual('APPLICATION_NOT_FOUND'); done(); }
        ));
    });

    it('should create application', done => {
        const app: ApplicationTile = cloneDeep(applications[0]);
        app.id = 'pip_test_app';
        app.description = { 'en': 'new description', 'ru': 'russian description' };
        subs.add(service.createApplication(app).subscribe(created => {
            expect(created).toEqual(app);
            done();
        }));
    });

    it('shouldn\'t create existing application', done => {
        const app: ApplicationTile = cloneDeep(applications[0]);
        subs.add(service.createApplication(app).subscribe(
            () => {},
            (error) => { expect(error.code).toEqual('APPLICATION_ALREADY_EXISTS'); done(); }
        ));
    });

    it('should delete application by id', done => {
        const appToDelete = cloneDeep(sample(applications));
        subs.add(service.deleteApplication(appToDelete.id).subscribe(aid => {
            expect(aid).toEqual(appToDelete.id);
            done();
        }));
    });

    it('should delete application by app', done => {
        const appToDelete: Application = cloneDeep(sample(applications));
        subs.add(service.deleteApplication(appToDelete).subscribe(aid => {
            expect(aid).toEqual(appToDelete.id);
            done();
        }));
    });

    it('shouldn\'t delete not existing application', done => {
        const appToDelete: Application = cloneDeep(sample(applications));
        appToDelete.id = 'bad_id';
        subs.add(service.deleteApplication(appToDelete).subscribe(
            () => {},
            (error) => { expect(error.code).toEqual('APPLICATION_NOT_FOUND'); done(); }
        ));
    });

});
