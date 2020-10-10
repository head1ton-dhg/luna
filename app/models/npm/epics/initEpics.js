import { pipe } from 'rxjs';
import { map, tap, switchMap, ignoreElements } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { ipcRenderer } from 'electron';

import { toggleLoader } from 'models/ui/actions';
import { runInit, runLock, npmInitListener } from 'models/npm/actions';
import { onNpmInit$ } from '../listeners';

const showInitLoaderEpic = (action$) =>
  action$.pipe(
    ofType(runInit.type),
    map(() =>
      toggleLoader({
        loading: true,
        message: 'Please wait. Initialize project...',
      })
    )
  );

const npmRunInitEpic = pipe(
  ofType(runInit.type),
  tap(({ payload }) =>
    ipcRenderer.send('npm-init', {
      ...payload,
      mode: 'local',
    })
  ),
  ignoreElements()
);

const npmRunLockEpic = pipe(
  ofType(runLock.type),
  tap(({ payload }) =>
    ipcRenderer.send('npm-init-lock', {
      ...payload,
      mode: 'local',
    })
  ),
  ignoreElements()
);

const npmRunInitListenerEpic = pipe(
  ofType(npmInitListener.type),
  switchMap(() => onNpmInit$)
);

export {
  npmRunInitEpic,
  npmRunLockEpic,
  npmRunInitListenerEpic,
  showInitLoaderEpic,
};
