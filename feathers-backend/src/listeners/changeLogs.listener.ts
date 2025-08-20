// src/listeners/changeLogs.listener.ts
import type { Application } from '../declarations';
import type { ChangeLogsData } from '../services/changelogs/changelogs.schema';

export const registerChangeLogListener = (app: Application) => {
  
  app.on('changelog:create', async (logData: ChangeLogsData) => {
    try {
      await app.service('change-logs').create(logData);
    } catch (error) {
      console.error('Failed to create changelog entry:', error);
    }
  });
};
