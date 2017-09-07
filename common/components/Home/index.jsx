import React, {Component, PropTypes} from 'react'
import {Card, CardTitle} from 'react-toolbox/lib/card'
import {List, ListItem} from 'react-toolbox'

import styles from './index.css'

export default class Home extends Component {
  render() {
    const {showUsers} = this.props
    const usersButton = (
      <ListItem
        caption="Users"
        leftIcon="people"
        key="users"
        onClick={this.props.onClickUsersButton}
        />
    )
    const profileButton = (
      <ListItem
        caption="Profile"
        leftIcon="account_box"
        key="profile"
        onClick={this.props.onClickEditProfileButton}
        />
    )
    const signOutButton = (
      <ListItem
        caption="Sign Out"
        leftIcon="subdirectory_arrow_left"
        key="signOut"
        onClick={this.props.onClickSignOutButton}
        />
    )

    const list = showUsers ? [usersButton] : []
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
  showUsers: PropTypes.bool.isRequired,
  onClickEditProfileButton: PropTypes.func.isRequired,
  onClickSignOutButton: PropTypes.func.isRequired,
  onClickUsersButton: PropTypes.func.isRequired,
}
