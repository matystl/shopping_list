import React from 'react';
import {DefaultRoute, NotFoundRoute, Route} from 'react-router';

//import custom components

import App from './components/App';
import Home from './components/Home';
import NotFound from './components/Notfound';
import Chat from './chat/Chat';

export default (
  <Route handler={App} path="/">
    <DefaultRoute handler={Home} name="home" />
    <NotFoundRoute handler={NotFound} name="not-found" />
    <Route handler={Chat} name="chat" path='chat/:id'/>
  </Route>
);
