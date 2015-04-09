/*eslint-disable no-console */

import React from 'react';
import compression from 'compression';
import config from './config';
import express from 'express';
import http from 'http';
import favicon from 'serve-favicon';
import render from './render';
import handler_newTodoList from './handlers/newTodoList';
import pgQuery from './pgConnect';
import Immutable from 'immutable';


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
      console.log(`1. want updated item ${JSON.stringify(msg)}`);
      const afterId = msg.afterId;
      const clientId = msg.id;
      const debugId = msg.debugCounter;
      console.log(`1.5 want updated item client Id: ${clientId} afterId: ${afterId}`);
      if (socket.room) {
        let resultOrder;
        console.log(`2. i am in room ${socket.room}`);
        pgQuery('INSERT into items (id, todo_id, text, checked) VALUES($1, $2, $3, $4) RETURNING id', [clientId, socket.room, '', false])
        .then((result) => {
          const resId = result.rows[0].id;
          console.log(`3. after query 1 ${JSON.stringify(result)} with id ${resId}`);
          return pgQuery('SELECT * FROM items_order WHERE todo_id = $1', [socket.room]);
        }).then((result) => {
          console.log(`4.after query for order raw ${JSON.stringify(result)}`);
          const iOrder = Immutable.List(result.rows[0].order);
          console.log(`4.after query for order ${iOrder}`);
          let prevIndex = iOrder.indexOf(afterId);
          if (prevIndex == -1) {
            prevIndex = iOrder.size - 1;
          };
          const iNewOrder =  iOrder.splice(prevIndex + 1,0, clientId);
          console.log(`4.after query new is order ${iNewOrder}`);
          return pgQuery('UPDATE items_order SET "order" = $2 WHERE todo_id = $1;',
                         [socket.room, iNewOrder.toJS()]);
        }).then((result) => {
          console.log(`4.5 writing new order succesfull ${result}`);
          return pgQuery('SELECT * FROM items_order WHERE todo_id = $1', [socket.room]);
        }).then((result) => {
          resultOrder = Immutable.List(result.rows[0].order);
          return pgQuery('SELECT * FROM items WHERE todo_id = $1',
                        [socket.room]);
        }).then((result) => {
          console.log(`5. after query select `);
          const newItems = JSON.parse(JSON.stringify(result.rows));
          const result = {order: resultOrder, items: newItems, debugCounter:debugId};
          socket.broadcast.to(socket.room).emit('new items', result);
          socket.emit('confirm new items', result);
        }).catch((e) => {
          console.log(`errrrrrrrrorrrrrrrrr with ${e}`);
        });
      } else {
        console.log(`1.5 socket is not in room`);
      }
    });

    socket.on('edit item', (msg) => {
      const {id, value} = msg;
      const debugId = msg.debugCounter;
      console.log(`debuj id ${debugId}`);
      console.log(`1. want updated item ${id} ${value} ${JSON.stringify(msg)}`);
      if (socket.room) {
        console.log(`2. i am in room ${socket.room}`);
        let newOrder; //here we will store current order of items
        pgQuery('UPDATE items SET text = $1 WHERE id = $2;', [value, id])
        .then((result) => {
          console.log(`3. after query 1 ${JSON.stringify(result)}`);
          return pgQuery('SELECT * FROM items_order WHERE todo_id = $1', [socket.room]);
        }).then((result) => {
          newOrder = Immutable.List(result.rows[0].order);
          return pgQuery('SELECT * FROM items WHERE todo_id = (SELECT todo_id FROM items WHERE id = $1)', [id]);
        }).then((result) => {
          console.log(`4. after query 1 ${id}`);
          const newItems = JSON.parse(JSON.stringify(result.rows));
          const result = {test:true, order: newOrder, items: newItems, debugCounter: debugId};
          socket.broadcast.to(socket.room).emit('new items', result);
          socket.emit('confirm new items', result);
        }).catch((e) => {
          console.log(`errrrrrrrrorrrrrrrrr with  ${err}`);
        });
      } else {
        console.log(`1.5 socket is not in room`);
      }
    });
  });

  server.listen(config.port);
  console.log(`nejaky random log`);
  console.log(`App started on port ${config.port}`);

}
