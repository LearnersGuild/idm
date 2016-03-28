import React, {Component} from 'react'

import {Card, CardTitle} from 'react-toolbox/lib/card'

import UserForm from '../containers/UserForm'
import styles from './Profile.scss'

export default class Profile extends Component {
  render() {
    return (
      <Card className={styles.card}>
        <CardTitle title="Edit Profile"/>
        <div className={styles.cardContent}>
          <UserForm buttonLabel="Save"/>
        </div>
      </Card>
    )
  }
}
