import React, {Component, PropTypes} from 'react'

import {Button} from 'react-toolbox/lib/button'
import {Card} from 'react-toolbox/lib/card'

import SignInButton from './SignInButton'

import styles from './SignInUp.scss'

export default class SignIn extends Component {
  render() {
    return (
      <Card className={styles.card}>
        <div className={styles.cardContent}>
          <img className={styles.lgIcon} src="https://icons.learnersguild.org/apple-touch-icon-60x60.png"/>
          <SignInButton buttonLabel="Sign-in"/>
        </div>
      </Card>
    )
  }
}
