import log from 'electron-log';
import { merge } from 'ramda';
import { switchcase } from '../commons/utils';
import { runCommand } from '../cli';
import mk from '../mk';

const {
  defaultSettings: { defaultManager },
} = mk || {};

const onNpmSearch = (event, options, store) => {
  const settings = store.get('user_settings');
  const { activeManager = defaultManager, ...rest } = options || {};

  const onFlow = (message) => event.sender.send('npm-command-flow', message);
  const onError = (error) => event.sender.send('npm-search-error', error);

  const onComplete = (errors, data) =>
    event.sender.send('npm-search-completed', data, errors);

  const callback = (result) => {
    const { status, errors, data, message } = result;

    return switchcase({
      flow: () => onFlow(message),
      close: () => onComplete(errors, data),
      error: (error) => onError(error),
    })(null)(status);
  };

  try {
    const params = merge(settings, {
      activeManager,
      ...rest,
    });

    runCommand(params, callback);
  } catch (error) {
    log.error(error);
    event.sender.send('npm-search-error', error && error.message);
  }
};

export default onNpmSearch;
