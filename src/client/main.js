import React from 'react';
import Router from 'react-router';
import routes from './routes';

import store_todo from './todos/store';
import store_chat from './chat/store';

import {state} from './state';

window.show = () => {
  state.toConsole();
};

// Never render to body. Everybody updates it.
// https://medium.com/@dan_abramov/two-weird-tricks-that-fix-react-7cf9bbdef375
const appElement = document.getElementById('app');

Router.run(routes, Router.HistoryLocation, (Handler) => {
  React.render(<Handler />, appElement);
});

// // TODO: Report app errors.
// if ('production' === process.env.NODE_ENV) {
// }
