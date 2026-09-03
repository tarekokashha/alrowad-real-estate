import * as migration_20260903_212902_initial from './20260903_212902_initial';

export const migrations = [
  {
    up: migration_20260903_212902_initial.up,
    down: migration_20260903_212902_initial.down,
    name: '20260903_212902_initial'
  },
];
