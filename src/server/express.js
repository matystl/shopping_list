/*eslint-disable no-console */

import React from 'react';
import compression from 'compression';
import config from './config';
import express from 'express';
import http from 'http';
import favicon from 'serve-favicon';
import render from './render';
import handler_newTodoList from './handlers/newTodoList';
import pgConnect from './pgConnect';
export default function() {

  const app = express();
  const server = http.Server(app);
  const io = require('socket.io')(server);



  app.use(compression());
  // TODO: Add favicon.
  // app.use(favicon('assets/img/favicon.ico'))
  // TODO: Move to CDN.
  app.use('/build', express.static('build'));
  app.use('/assets', express.static('assets'));

  app.get('/newTodoList/', handler_newTodoList);

  app.get('*', (req, res) => {
    const acceptsLanguages = req.acceptsLanguages(config.appLocales);
    render(req, res, acceptsLanguages || config.defaultLocale)
      .catch((error) => {
        const msg = error.stack || error;
        console.log(msg);
        res.status(500).send('500: ' + msg);
      });
  });

  io.on('connection', function(socket){
    console.log('A user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });

    socket.on('join room', function(msg){
      console.log(`user ${socket.id} join room ${msg}`);
      socket.join(msg);
      socket.room = msg;
    });
    socket.on('leave room', function(msg){
      console.log(`user ${socket.id} leeve room ${msg}`);
      socket.leave(msg);
      socket.room = null;
    });

    socket.on('add item', (msg) => {
      const clientId = msg;
      console.log(`1. want updated item ${JSON.stringify(msg)}`);
      if (socket.room) {
        console.log(`2. i am in room ${socket.room}`);
        pgConnect((err, client, done) => {
          client.query(
            'INSERT into items (id, todo_id, text, checked) VALUES($1, $2, $3, $4) RETURNING id',
            [clientId, socket.room, '', false],
            function(err, result) {
              const resId = result.rows[0].id;
              console.log(`3. after query 1 ${JSON.stringify(result)} with id ${resId}`);

              client.query(
                'SELECT * FROM items WHERE todo_id = $1',
                [socket.room],
                function(err, result) {
                  console.log(`4. after query 1 `);
                  done();
                  const newItems = JSON.parse(JSON.stringify(result.rows));
                  socket.broadcast.to(socket.room).emit('new items', newItems);
                  socket.emit('confirm new items', newItems);
                  client.end();
              });
            }
          );
        });
      } else {
        console.log(`1.5 socket is not in room`);
      }
    });

    socket.on('edit item', (msg) => {
      const {id, value} = msg;
      console.log(`1. want updated item ${id} ${value} ${JSON.stringify(msg)}`);
      if (socket.room) {
        console.log(`2. i am in room ${socket.room}`);
        pgConnect((err, client, done) => {
          client.query(
            'UPDATE items SET text = $1 WHERE id = $2;',
            [value, id],
            function(err, result) {
              console.log(`3. after query 1 ${JSON.stringify(result)}`);

              client.query('SELECT * FROM items WHERE todo_id = (SELECT todo_id FROM items WHERE id = $1)', [id], function(err, result) {
                  console.log(`4. after query 1 ${id}`);
                  done();
                  const newItems = JSON.parse(JSON.stringify(result.rows));
                  socket.broadcast.to(socket.room).emit('new items', newItems);
                  socket.emit('confirm new items', newItems);
                  client.end();
              });
            }
          );
        });
      } else {
        console.log(`1.5 socket is not in room`);
      }
    });

    socket.on('chat in room', function(msg) {
      console.log(`message from client in room:${socket.room} msg: ${JSON.stringify(msg)}`);
      if (socket.room) {
        socket.broadcast.to(socket.room).emit('new chat from room', {text: `room msg ${JSON.stringify(msg)}`, dataMap: msg});
        socket.emit('new chat from room', {text: `room msg from you ${JSON.stringify(msg)}`, dataMap: msg});
      }
    });

    socket.on('chat message', function(msg){
      socket.emit('new chat', 'i get chat massage from you' +  JSON.stringify(msg));
      socket.broadcast.emit('new chat', 'i get chat massage ' +  JSON.stringify(msg));
      console.log('message from client: ' + JSON.stringify(msg));
    });
  });

  server.listen(config.port);
  console.log(`nejaky random log`);
  console.log(`App started on port ${config.port}`);

}
