import React, {Component, PropTypes} from 'react'
import {Card, CardTitle} from 'react-toolbox/lib/card'
import {List, ListItem} from 'react-toolbox'

import styles from './index.css'

export default class Home extends Component {
  render() {
    return (
      <Card className={styles.card}>
        <CardTitle
          avatar="https://brand.learnersguild.org/apple-touch-icon-60x60.png"
          title="Identity Management"
          />
        <List selectable ripple className={styles.cardContent}>
          <ListItem
            caption="Edit Profile"
            leftIcon="account_box"
            onClick={this.props.onEditProfile}
            />
          <ListItem
            caption="Explore API"
            leftIcon="flash_on"
            onClick={this.props.onGraphiQL}
            />
          <ListItem
            caption="Sign Out"
            leftIcon="subdirectory_arrow_left"
            onClick={this.props.onSignOut}
            />
        </List>
      </Card>
    )
  }
}

Home.propTypes = {
  onEditProfile: PropTypes.func.isRequired,
  onGraphiQL: PropTypes.func.isRequired,
  onSignOut: PropTypes.func.isRequired,
}
