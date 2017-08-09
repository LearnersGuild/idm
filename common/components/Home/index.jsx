import React, {Component, PropTypes} from 'react'
import {Card, CardTitle} from 'react-toolbox/lib/card'
import {List, ListItem} from 'react-toolbox'

import styles from './index.css'

export default class Home extends Component {
  render() {
    const {isAdmin} = this.props
    const usersButton = (
      <ListItem
        caption="All Users"
        leftIcon="people"
        key="users"
        onClick={this.props.onNavigateUsers}
        />
    )
    const profileButton = (
      <ListItem
        caption="Edit Profile"
        leftIcon="account_box"
        key="profile"
        onClick={this.props.onEditProfile}
        />
    )
    const signOutButton = (
      <ListItem
        caption="Sign Out"
        leftIcon="subdirectory_arrow_left"
        key="signOut"
        onClick={this.props.onSignOut}
        />
    )

    const list = isAdmin ? [usersButton] : []
    const listItems = list.concat([profileButton, signOutButton])

    return (
      <Card className={styles.card}>
        <CardTitle
          avatar="https://brand.learnersguild.org/apple-touch-icon-60x60.png"
          title="Identity Management"
          />
        <List selectable ripple className={styles.cardContent}>
          {listItems}
        </List>
      </Card>
    )
  }
}

Home.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  onEditProfile: PropTypes.func.isRequired,
  onSignOut: PropTypes.func.isRequired,
  onNavigateUsers: PropTypes.func.isRequired,
}
