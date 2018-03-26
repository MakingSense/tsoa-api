import { resolve as pathResolve } from 'path';
import { config } from 'dotenv';

const { env } = process;
config({ path: pathResolve(__dirname, `./env/.env.${env.NODE_ENV}`) });

export default {
  environment: env.NODE_ENV,
  port: Number(env.PORT),
  mongoConnectionString: env.MONGO_CONNECTION_STRING
}
