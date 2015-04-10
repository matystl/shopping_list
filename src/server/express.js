/*eslint-disable no-console */

import React from 'react';
import compression from 'compression';
import config from './config';
import express from 'express';
import http from 'http';
import favicon from 'serve-favicon';
import render from './render';
import handler_newTodoList from './handlers/newTodoList';
import {pgQuery} from './pgConnect';
import Immutable from 'immutable';
import {editTodo} from './handlers/editTodo';
import {addTodo} from './handlers/addTodo';
import {deleteTodo} from './handlers/deleteTodo';

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
    console.log(`A user ${socket.id} connected`);

    socket.on('disconnect', function(){
      console.log(`user ${socket.id} disconnected`);
    });

    socket.on('sync todo', function(msg){
      console.log(`user ${socket.id} start sync on ${msg}`);
      socket.join(msg);
      socket.room = msg;
    });

    socket.on('unsync todo', function(msg){
      console.log(`user ${socket.id} stop sync on ${msg}`);
      socket.leave(msg);
      socket.room = null;
    });

    socket.on('add item', (_) => addTodo(socket, _));
    socket.on('edit item', (_) => editTodo(socket, _));
    socket.on('delete item', (_) => deleteTodo(socket, _));

  });

  server.listen(config.port);
  console.log(`nejaky random log`);
  console.log(`App started on port ${config.port}`);

}
