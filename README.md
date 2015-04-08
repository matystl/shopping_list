# Shopping list

How to run it
  1. Clone the repo
  2. `npm install` (if fails try more times)
  3. install postgre
  4. initialize postgre

      create user skill with password skill (optionaly change config in `src/server/config.js:dbConnectionString: your_connection_string`)

      create db `todo_list`
      
      create table for items with `CREATE TABLE items(db_id serial primary key, id UUID NOT NULL, todo_id UUID NOT NULL, text text, checked boolean);`
      
      create table for order with `CREATE TABLE items_order(db_id serial primary key, todo_id UUID NOT NULL, order UUID ARRAY);`
      
  5. run with `gulp`

most of custom code is in `src/cliet/chat`

after start of application click to 3. link `Open new todo list in new tab` this will create new todo list. Copy url to different tab. Write to last input box and see it synchronized. Open `psql -U skill` and run query `SELECT * from items;` to see that it's saved in db. Check server side rendering(open todo list in tab with disabled javascript and see that it has been loaded with item).

Currently is supported only items created when todo list is inicialized so no new items. Howewer if you want to have more than 1 item modify `src/server/handlers/newTodoList.js` and create in inicialization more items.

Maty


## Techniques

- ES6 and other future JavaScripts dialects with the best transpiler [babeljs.io](https://babeljs.io/). [JSX](http://facebook.github.io/react/docs/jsx-in-depth.html) and [Flowtype](http://flowtype.org/) syntax supported as well. Sourcemaps enabled by default.
- [jest](https://facebook.github.io/jest) unit testing.
- [eslint](http://eslint.org/) ES6 linting with [React](https://github.com/yannickcr/eslint-plugin-react) JSX support.
- Isomorphic architecture with stateless actions and stores.
- Server side rendering.
- Localization with [formatjs.io](http://formatjs.io/), stale browsers supported as well.
- [React](http://facebook.github.io/react/) with [Flux](https://facebook.github.io/flux/) with [immutable](http://facebook.github.io/immutable-js) global app state like Om or [Omniscient](https://github.com/omniscientjs/omniscient/wiki/Simpler-UI-Reasoning-with-Unidirectional-Dataflow-and-Immutable-Data).
- Mobile first, offline first, frontend first.
- Vanilla Flux, we don't need over abstracted frameworks.
- Webpack css livereload with hot module reload even for React components.
- Easy undo/redo and app state load/save.
- Super fast rendering with [immutable.js](http://facebook.github.io/immutable-js).
- Well tuned webpack devstack with handy [notifier](https://github.com/mikaelbr/node-notifier).
- [ftlabs/fastclick](https://github.com/ftlabs/fastclick) for fast click on touch devices
- LESS, SASS, Stylus, or plain CSS with [autoprefixer](https://github.com/postcss/autoprefixer).
- Optimized for [critical rendering path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path).
- Google Analytics preconfigured.
- [react-router](https://github.com/rackt/react-router) for routing on client and server side.
- Simple yet powerfull sync/async validation based on famous [chriso/validator.js](https://github.com/chriso/validator.js)
- Authentication form and reusable `auth` [higher order](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750) component to protect access to specific components. 

## Prerequisites

Install [iojs](https://iojs.org/) or [node.js](http://nodejs.org).
Then install [gulp.js](http://gulpjs.com/).
```shell
npm install -g gulp
```

Windows users, please read [ryanlanciaux.github.io/blog/2014/08/02/using-jest-for-testing-react-components-on-windows/](http://ryanlanciaux.github.io/blog/2014/08/02/using-jest-for-testing-react-components-on-windows/). sass-loader needs something similar, so please fix it for yourself, or remove sass-loader from `package.json` and `makeconfig.js`, or give it up and use developer more friendly OS like Linux or Mac. I just tried to install Python 2.7 on Windows but installation has failed for no reason. Typical Windows, so happy I quit.

## Create App

```shell
git clone https://github.com/steida/este.git myapp
cd myapp
npm install
```

## Start Development

- run `gulp`
- point your browser to [localhost:8000](http://localhost:8000)
- build something beautiful

## Dev Tasks

- `gulp` run app in development mode
- `gulp -p` run app in production mode
- `gulp test`

## CI Tasks

- `npm start` just run app, remember to set NODE_ENV=production and others environment variables.
- `npm postinstall` just alias for `gulp build --production`, useful for Heroku.
- `npm test` just alias for `gulp test`

## Examples

- [Este TodoMVC](https://github.com/steida/este-todomvc)

## Documentation

So you decided to give a chance to this web stack, but where is documentation? Code is documentation itself as it illustrates various patterns, but for start you should read something about [React.js](http://facebook.github.io/react/). Then you should learn [what is the Flux
application architecture](https://medium.com/brigade-engineering/what-is-the-flux-application-architecture-b57ebca85b9e). Now refresh you JavaScript knowledge about "new" JavaScript - [learn ES6](https://babeljs.io/docs/learn-es6/). This stack uses [immutable.js](http://facebook.github.io/immutable-js/) and for a [good reason](https://github.com/facebook/immutable-js/#the-case-for-immutability). Check this nice short [video](https://www.youtube.com/watch?v=5yHFTN-_mOo Ok, Server side you.http://expressjs.com/), to see one of many great advantages of [functional programming](http://www.smashingmagazine.com/2014/07/02/dont-be-scared-of-functional-programming/). [Express.js](http://expressjs.com/) is used on the [Node.js](http://nodejs.org/api/) based server. Application is [isomorphic](http://isomorphic.net/javascript), so we can share code between client and server easily. Congrats, now you're Este.js expert level 1 :-)

## Links

- [wiki/Recommended-React-Components](https://github.com/steida/este/wiki/Recommended-React-Components)
- [twitter.com/estejs](https://twitter.com/estejs)
- [github.com/enaqx/awesome-react](https://github.com/enaqx/awesome-react)

## Tips and Tricks and Lips and Tits

- App state snapshot: Press `shift+ctrl+s`, then open dev console and type `_appState`.
- With global immutable app state, you don't need IoC container so badly - [SOLID: the next step is Functional](http://blog.ploeh.dk/2014/03/10/solid-the-next-step-is-functional). Still DI is relevant for some cases and then use [Pure DI](http://blog.ploeh.dk/2014/06/10/pure-di/).
- Use `const` by default, `let` if you have to rebind a variable.
- Use `() =>` lambda expression for all predicates and anonymous functions.
- Learn and use immutable [Seq](https://github.com/facebook/immutable-js#lazy-seq). Very handy for native arrays and objects. Get object values: `Seq(RoomType).toSet().toJS()`
- If React props are immutable or primitive, subclass from PureComponent. Simple rule for ultimate performance.
- Never mock browser inside server code, it can confuse isomorphic libraries.
- Always use settostring helper for actions.
- Even though we can use `import {canUseDOM} from 'react/lib/ExecutionEnvironment'` to detect browser/server, don't use it since it's runtime value. Use webpack DefinePlugin to set process.env.IS_BROWSER rather, because compilation removes dead code then.
- [aeflash.com/2015-02/react-tips-and-best-practices.html](http://aeflash.com/2015-02/react-tips-and-best-practices.html)
- Why React `this.state` isn't used? Because whole app state belongs to app one global immutable app state. So we can log it easily, user can navigate out page with half fulfilled form without losing its state, and more.
- You can still use Closure Tools, [gist](https://gist.github.com/steida/afbc595a1e2f27e925d9)
- Recommended editor is [atom.io](https://atom.io) ([tips](https://github.com/steida/atom-io-settings)) or [sublimetext](http://www.sublimetext.com/).

## Notes

- Este.js dev stack should work on OSX, Linux, and even Windows. Feel free to report any issue.
- As a rule of thumb, Este.js supports all evergreen browsers plus last two pieces of IE. In theory, It should not be hard to support IE8 as hell.

## Credit

<img alt="Este.js" src="https://cloud.githubusercontent.com/assets/66249/6515278/de638916-c388-11e4-8754-184f5b11e770.jpeg" width="200">

made by Daniel Steigerwald, [twitter.com/steida](https://twitter.com/steida)
