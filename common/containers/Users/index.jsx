/* eslint-disable no-undef */
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import findUsers from 'src/common/actions/findUsers'
import UsersComponent from 'src/common/components/Users'

import styles from './index.css'

const tableModel = {
  avatarUrl: {title: 'Photo', type: String},
  name: {title: 'Name', type: String},
  handle: {title: 'Handle', type: String},
  email: {title: 'Email', type: String},
  active: {title: 'Active', type: Boolean}
}

export class UsersContainer extends Component {

  componentDidMount() {
    this.constructor.fetchData(this.props.dispatch, this.props)
  }

  static fetchData(dispatch) {
    dispatch(findUsers())
  }

  render() {
    const {isBusy, users} = this.props
    const userData = users.map(user => {
      const mailtoURL = `mailto:${user.email}`
      const altTitle = `${user.name} (${user.handle})`
      return Object.assign({}, user, {
        avatarUrl: (
          <Link href={user.profileUrl}>
            <img
              className={styles.userImage}
              src={user.avatarUrl}
              alt={altTitle}
              title={altTitle}
              />
          </Link>
        ),
        handle: <Link href={user.profileUrl} className={styles.userLink}>{user.handle}</Link>,
        name: <Link href={user.profileUrl} className={styles.userLink}>{user.name}</Link>,
        email: <Link href={mailtoURL} className={styles.userLink}>{user.email}</Link>,
        active: user.active ? 'Yes' : 'No',
      })
    })

    return isBusy ? null : (
      <div>
        <UsersComponent users={userData} model={tableModel}/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {users} = state
  return users
}

UsersContainer.propTypes = {
  users: PropTypes.array.isRequired,
  isBusy: PropTypes.bool.isRequired,
  children: PropTypes.any,
  dispatch: PropTypes.func.isRequired,
}

export default connect(
  mapStateToProps
)(UsersContainer)
