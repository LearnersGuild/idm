import React, {Component} from 'react'

import {Card, CardTitle, CardText} from 'react-toolbox/lib/card'

export default class Home extends Component {
  render() {
    return (
      <Card>
        <CardTitle title="Home"/>
        <CardText>
          This is the home route.
        </CardText>
      </Card>
    )
  }
}
