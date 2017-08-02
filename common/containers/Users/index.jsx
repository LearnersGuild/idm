/* global __CLIENT__ */
/* eslint-disable no-undef */
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import findUsers from 'src/common/actions/findUsers'
import redirect from 'src/common/actions/redirect'
import UsersComponent from 'src/common/components/Users'

const tableModel = {
    name: {title: 'Name', type: String},
    handle: {title: 'Handle', type: String},
    email: {title: 'Email', type: String},
  }

export class UsersContainer extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.constructor.fetchData(this.props.dispatch, this.props)
  }



  static fetchData(dispatch, props) {
    dispatch(findUsers())
  }

  render() {
    console.log('props ===========',this.props)
    const {users} = this.props

    return (
      <div>
        <h1>{'This is the UsersContainer'}</h1>
        <UsersComponent users={users} model={tableModel}/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return state.users
}

UsersContainer.propTypes = {
  children: PropTypes.any,
  dispatch: PropTypes.func.isRequired,
}

export default connect(
  mapStateToProps
)(UsersContainer)
