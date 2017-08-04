import React, {Component, PropTypes} from 'react'
import {Card, CardTitle} from 'react-toolbox/lib/card'
import {List, ListItem} from 'react-toolbox'

import styles from './index.css'

export default class Home extends Component {
  render() {
    const usersButton = (
      <ListItem
        caption="All Users"
        leftIcon="people"
        onClick={this.props.onNavigateUsers}
        />
    )
    const usersLink = this.props.isAdmin ? usersButton : null
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
            caption="Sign Out"
            leftIcon="subdirectory_arrow_left"
            onClick={this.props.onSignOut}
            />
          {usersLink}
        </List>
      </Card>
    )
  }
}

Home.propTypes = {
  isAdmin: PropTypes.bool,
  onEditProfile: PropTypes.func.isRequired,
  onSignOut: PropTypes.func.isRequired,
  onNavigateUsers: PropTypes.func.isRequired,
}
