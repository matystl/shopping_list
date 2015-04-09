import pg from 'pg';
import config from './config';
import Promise from 'bluebird';

export default (query, query_params) => {
  return new Promise((resolve, reject) => {
    pg.connect(config.dbConnectionString, (err, client, done) => {
      if(err) {
        reject(err);
      } else {
        client.query(query, query_params, (err, result) => {
          done();
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      }
    })
  });
}
