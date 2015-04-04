import pg from 'pg';
import config from './config';

export default (x) => pg.connect(config.dbConnectionString,x);
