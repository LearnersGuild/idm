import React, {Component, PropTypes} from 'react'

import Card from 'material-ui/lib/card/card'
import CardTitle from 'material-ui/lib/card/card-title'
import CardText from 'material-ui/lib/card/card-text'

export default class Home extends Component {
  render() {
    return (
      <Card>
        <CardTitle title="Home" />
        <CardText>
          This is the home route.
        </CardText>
      </Card>
    )
  }
}
