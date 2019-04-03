import { TestBed } from '@angular/core/testing';
import { SitesDataService, SitesService } from './services/index';

import { SitesModule } from './sites.module';

describe('SitesModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SitesModule]
    });
  });

  it(`should not provide 'SitesService' service`, () => {
    expect(() => TestBed.get(SitesService)).toThrowError(/No provider for/);
  });

  it(`should provide 'SitesDataService' service`, () => {
    expect(() => TestBed.get(SitesDataService)).toBeTruthy();
  });
});
