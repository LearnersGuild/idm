import React, {Component} from 'react'
import {CardTitle} from 'react-toolbox/lib/card'

// FIXME: "dumb" components shouldn't import containers
import UserForm from 'src/common/containers/UserForm'

import styles from './index.css'

export default class Profile extends Component {
  render() {
    return (
      <div className={styles.card}>
        <CardTitle title="Edit Profile"/>
        <div className={styles.cardContent}>
          <UserForm buttonLabel="Save"/>
        </div>
      </div>
    )
  }
}
