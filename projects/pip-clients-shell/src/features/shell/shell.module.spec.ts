import { TestBed } from '@angular/core/testing';
import merge from 'lodash/merge';

import { ShellConfig, defaultShellConfig } from './models/index';
import { ShellService } from './services/shell.service';
import { ShellModule } from './shell.module';
import { AuthGuard, SessionService } from '../session/index';

describe('ShellModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ShellModule]
    });
  });

  it(`should not provide 'AuthGuard' service`, () => {
    expect(() => TestBed.get(AuthGuard)).toThrowError(/No provider for/);
  });

  it(`should not provide 'SessionService' service`, () => {
    expect(() => TestBed.get(SessionService)).toThrowError(/No provider for/);
  });

  it(`should not provide 'ShellService' service`, () => {
    expect(() => TestBed.get(ShellService)).toThrowError(/No provider for/);
  });
});

describe('ShellModule.forRoot()', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ShellModule.forRoot()]
    });
  });

  it(`should provide 'AuthGuard' service`, () => {
    expect(() => TestBed.get(AuthGuard)).toBeTruthy();
  });

  it(`should provide 'SessionService' service`, () => {
    expect(() => TestBed.get(SessionService)).toBeTruthy();
  });

  it(`should provide 'ShellService' service`, () => {
    expect(() => TestBed.get(ShellService)).toBeTruthy();
  });
});

describe('ShellModule.forRoot() with config', () => {
  const config: ShellConfig = {
    shadows: {
      top: false
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ShellModule.forRoot({ shell: config })]
    });
  });

  it(`should provide 'ShellService' with config`, () => {
    const service: ShellService = TestBed.get(ShellService);
    const expectedConfig = merge({}, defaultShellConfig, config);
    expect(service.getConfig()).toEqual(expectedConfig);
  });
});
