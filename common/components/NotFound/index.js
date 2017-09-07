import React, {Component} from 'react'
import {CardTitle, CardText} from 'react-toolbox/lib/card'
import {Button} from 'react-toolbox/lib/button'

export default class NotFound extends Component {
  render() {
    return (
      <div>
        <CardTitle
          avatar="https://brand.learnersguild.org/apple-touch-icon-60x60.png"
          title="Not Found"
          />
        <CardText>Womp womp. The requested page was not found.</CardText>
        <Button href="/" label="Back to Home"/>
      </div>
    )
  }
}
