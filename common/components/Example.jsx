import React, {Component} from 'react'

import Card from 'material-ui/lib/card/card'
import CardTitle from 'material-ui/lib/card/card-title'
import CardText from 'material-ui/lib/card/card-text'

export default class Example extends Component {
  render() {
    return (
      <Card>
        <CardTitle title="Example Route" />
        <CardText>
        This is just an example of routing.
        </CardText>
      </Card>
    )
  }
}
