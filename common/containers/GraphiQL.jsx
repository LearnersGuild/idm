/* global __CLIENT__ */
import './graphiQLHacks' // this is terrible, but GraphiQL doesn't support SSR
import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'

import GraphiQLComponent from 'graphiql'

import {getGraphQLFetcher} from '../util'

import 'graphiql/graphiql.css'

class GraphiQL extends Component {
  constructor(props) {
    super(props)
    this.resizeGraphiQL = this.resizeGraphiQL.bind(this)
  }

  resizeGraphiQL(component) {
    // hack warning -- GraphiQL expands to fill the parent div, so we need to
    // ensure that our height is 100% up the chain
    if (__CLIENT__) {
      let node = ReactDOM.findDOMNode(component)
      while (node) {
        node = node.parentNode
        if (node.tagName === 'BODY') {
          break
        }
        node.style.height = '100%'
      }
    }
  }

  render() {
    const {dispatch, auth} = this.props
    return (
      <GraphiQLComponent ref={this.resizeGraphiQL} fetcher={getGraphQLFetcher(dispatch, auth, false)}/>
    )
  }
}

GraphiQL.propTypes = {
  auth: PropTypes.shape({
    isBusy: PropTypes.bool.isRequired,
    currentUser: PropTypes.object,
  }),
  dispatch: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  }
}

export default connect(mapStateToProps)(GraphiQL)
