import { join } from 'path';
import { readdirSync, unlinkSync } from 'fs';
import * as ts from 'typescript';
import * as Umzug from 'umzug';

import { iocContainer } from '../ioc';
import { Logger } from '../config/Logger';
import constants from '../config/constants';
import { SQLDbConnection } from '../config/SQLDbConnection';
import { SQLSetupHelper } from '../config/SQLSetupHelper';

(async () => {
  try {
    const direction: string = process.env.MIGRATION_DIRECTION;
    const action: string = process.env.MIGRATION_ACTION;
    Logger.log(`starting SQL ${action} **${direction}** on ${constants.environment} environment`);
    const { db } = iocContainer.get<SQLDbConnection>(SQLDbConnection);
    const helper = iocContainer.get<SQLSetupHelper>(SQLSetupHelper);

    Logger.info('creating tables');
    await helper.sync();
    await db.authenticate();
    
    const options = require('../../tsconfig.json');
    const folder = join(__dirname, `./${action}`);
    const tsNames: string[] = readdirSync(folder)
    .filter(n => /.ts$/.test(n))
    .map(n => `${folder}/${n}`);
    
    Logger.info('compiling migration files');
    const program = ts.createProgram(tsNames, options);
    program.emit();

    const jsNames: string[] = readdirSync(folder)
      .filter(f => /.js$/.test(f))
      .map(n => `${folder}/${n}`);
    const umzug = new Umzug({
      storage: 'sequelize',
      storageOptions: {
        sequelize: db
      },
      migrations: {
        params: [db.getQueryInterface()],
        path: join(__dirname, `./${action}`),
        pattern: /.js$/
      }
    });

    Logger.info('running migrations');
    await umzug[direction]();
    Logger.info('cleaning up');
    jsNames.forEach(n => unlinkSync(n));
    process.exit();
  } catch (e) {
    Logger.error(e);
    process.exit(1);
  }
})();
