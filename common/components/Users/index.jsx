import React, {Component, PropTypes} from 'react'
import {Card, CardTitle} from 'react-toolbox/lib/card'
import {Table} from 'react-toolbox'

import styles from './index.css'

export default class UsersComponent extends Component {
  render() {
    const {users, model} = this.props
    return (
      <Table source={users} model={model}/>
    )
  }
}

UsersComponent.propTypes = {

}
