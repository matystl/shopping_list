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
          This is simple inner component of home.
        </p>
      </div>
    );
  }

}
