import pg from 'pg';
import config from './config';
import Promise from 'bluebird';

export function pgQuery(query, query_params) {
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
};

export function pgTransaction(callback) {
  return new Promise((resolve, reject) => {
    pg.connect(config.dbConnectionString, (err, client, done) => {
      if(err) {
        reject(err);
      } else {
        const pgQuery = (query, query_params) => {
          return new Promise((resolve, reject) => {
            client.query(query, query_params, (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            });
          });
        };

        const rollback = (client, done) => {
          console.log(`ROLLBACK`);
          client.query('ROLLBACK', function(err) {
            //if there was a problem rolling back the query
            //something is seriously messed up.  Return the error
            //to the done function to close & remove this client from
            //the pool.  If you leave a client in the pool with an unaborted
            //transaction weird, hard to diagnose problems might happen.
            return done(err);
          });
        };
        console.log(`BEGIN`);
        client.query('BEGIN', function(err) {
          if(err) {
            rollback(client, done);
            reject(err);
          } else {
            callback(pgQuery)
            .then((x) => {
              console.log(`COMMIT`);
              client.query('COMMIT', done);
              resolve(x);
            }).catch((e) =>  {
              rollback(client, done);
              reject(e)
            });
          }
        });
      }
    });
  });
};
