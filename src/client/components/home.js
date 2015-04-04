import React from 'react';
import {Link} from 'react-router';

export default class Home extends React.Component {

  componentWillMount() {

      console.log("Test mountu homu")
  }

  render() {
    return (
      <div>
        <p>
          App starter kit2 for <a href="https://github.com/steida/este">
          Este.js</a>. Check <Link to="todos">todos</Link>.
        </p>
      </div>
    );
  }

}
