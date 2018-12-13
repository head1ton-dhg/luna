/* eslint-disable */

import cp from 'child_process';
import os from 'os';
import Q from 'q';
import path from 'path';
import chalk from 'chalk';
import mk from '../mk';

const { spawn } = cp;
const { log } = console;
const { config } = mk;
const {
  defaultSettings: { defaultManager }
} = config;

const cwd = process.cwd();
const deferred = Q.defer();
const platform = os.platform();

const execute = (
  manager = defaultManager,
  commandArgs,
  mode,
  directory,
  callback
) => {
  log(
    chalk.white.bold(
      `running: (${mode.toUpperCase()}) ${manager} ${commandArgs.join(
        ' '
      )} ${directory && 'in ' + directory}`
    )
  );

  let result = '';
  let error = '';

  // on windows use npm.cmd
  const command = spawn(
    /^win/.test(process.platform) ? `${manager}.cmd` : manager,
    commandArgs,
    {
      env: process.env,
      cwd: mode === 'LOCAL' && directory ? path.dirname(directory) : cwd
    }
  );

  command.stdout.on('data', data => {
    const dataToString = data.toString();

    result += dataToString;
    callback('flow', commandArgs, dataToString);
  });

  command.stderr.on('data', err => {
    const errorToString = err.toString();

    error += `${errorToString} | `;
    callback('error', commandArgs, errorToString);
  });

  command.on('exit', code => {
    log(chalk.yellow.bold(`child exited with code ${code}`));
  });

  command.on('close', () => {
    log(chalk.green.bold(`finished: ${manager} ${commandArgs.join(' ')}`));

    const results = {
      status: 'close',
      error: Boolean(error.length) ? error : null,
      data: result,
      cmd: commandArgs
    };

    deferred.resolve(results);
  });

  return deferred.promise;
};

/**
 * List command
 *
 * */

exports.list = (callback, options) => {
  const command = ['list'];
  const { mode, directory } = options || {};
  const defaults = ['--json', '--depth=0', '--parseable'];

  if (!callback || typeof callback !== 'function') {
    return Q.reject(
      new Error(`callback parameter must be given and must be a function`)
    );
  }

  const commandArgs = mode === 'GLOBAL' ? [].concat(defaults, '-g') : defaults;
  const run = [].concat(command).concat(commandArgs.reverse());

  // support npm list command only
  return execute('npm', run, mode, directory, callback);
};