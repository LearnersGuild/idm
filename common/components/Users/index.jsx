import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {CardTitle} from 'react-toolbox/lib/card'
import {Table} from 'react-toolbox'

export default class UsersComponent extends Component {
  render() {
    const {users, model} = this.props
    return (
      <div>
        <CardTitle title="Users"/>
        <div>
          <Table source={users} model={model} selectable={false}/>
        </div>
      </div>
    )
  }
}

UsersComponent.propTypes = {
  model: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired
}
