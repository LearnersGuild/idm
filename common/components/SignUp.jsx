import React from 'react'

import Input from 'react-toolbox/lib/input'
import {Button} from 'react-toolbox/lib/button'
import {Card} from 'react-toolbox/lib/card'

import UserForm from './UserForm'

import styles from './SignInUp.scss'

export default function signUp() {
  return (
    <Card className={styles.card}>
      <div className={styles.cardContent}>
        <img className={styles.lgIcon} src="https://icons.learnersguild.org/apple-touch-icon-60x60.png"/>
        <UserForm/>
      </div>
    </Card>
  )
}
