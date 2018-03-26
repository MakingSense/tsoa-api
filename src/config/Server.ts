import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';

import { ErrorHandler } from './ErrorHandler';
import { RegisterRoutes } from '../../build/routes';
import { Logger } from './Logger';
import '../controllers';

export class Server {
  public app: express.Express = express();
  private readonly port: number = 3030;

  constructor() {
    this.app.use(this.allowCors);
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(expressWinston.logger({ transports: [new winston.transports.Console({ colorize: true })] }));
    RegisterRoutes(this.app);
    this.app.use(ErrorHandler.handleError);
  }

  public listen(port: number = this.port): void {
    this.app.listen(this.port);
    Logger.log(`listening to port: ${this.port}`);
  }

  private allowCors (req: express.Request, res: express.Response, next: express.NextFunction): void {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  }

}
