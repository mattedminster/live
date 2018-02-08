import { autobind } from 'core-decorators'
import parseHeaders from 'http-headers'
import { isLoopback, isV4Format, isV6Format } from 'ip'
import { partial } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import url from 'url'

import dns from '@dns'
import SSDPClient from '@ssdp'

import {
  addDetectedServer,
  addInferredServer,
  removeAllDetectedServers,
  startScanning,
  stopScanning,
  updateDetectedServerLabel
} from '../actions/servers'

export const isServerDetectionSupported = !SSDPClient.isMock

/**
 * Presentation component that regularly fires SSDP discovery requests and
 * collects the results when the app is running in a Node.js environment.
 * When UDP sockets are not available (e.g., in the browser), the component
 * simply makes an educated guess for a possible Flockwave server hosted on
 * the same machine as the current page is.
 */
class ServerDetectionManagerPresentation extends React.Component {
  constructor (props) {
    super(props)

    this._ssdpClient = undefined
    this._timer = undefined
  }

  componentDidMount () {
    const { onScanningStarted, onServerInferred } = this.props

    if (!isServerDetectionSupported) {
      if (onServerInferred) {
        onServerInferred(window.location.hostname, 5000)
      }
      return
    }

    if (onScanningStarted) {
      onScanningStarted()
    }

    this._ssdpClient = new SSDPClient()
    this._ssdpClient.on('response', (headers, rinfo) => {
      if (this._ssdpClient === undefined) {
        // Component was already unmounted.
        return
      }

      const parsedHeaders = parseHeaders(headers)
      if (parsedHeaders.statusCode !== 200) {
        // Not a successful response
        return
      }

      const location = parsedHeaders.headers['location']
      if (location === undefined) {
        // No location given
        return
      }

      const { hostname, port, protocol } = url.parse(location)
      if (protocol !== 'sio:' && protocol !== 'sios:') {
        // We only support Socket.IO and secure Socket.IO
        return
      }

      const numericPort = Number(port)
      if (!hostname || isNaN(numericPort) || numericPort <= 0 || numericPort > 65535) {
        // Invalid hostname or port
        return
      }

      if (this.props.onServerDetected) {
        const { key, wasAdded } = this.props.onServerDetected(hostname, numericPort)

        // Perform a DNS lookup on the hostname if was newly added, it is not
        // already a hostname and we have access to the DNS module
        if (key && wasAdded && (isV4Format(hostname) || isV6Format(hostname))) {
          const resolveTo = partial(this.props.onServerHostnameResolved, key)
          if (isLoopback(hostname)) {
            resolveTo('This computer')
          } else {
            dns.reverse(hostname, (err, names) => {
              if (!err && names && names.length > 0) {
                resolveTo(names[0])
              }
            })
          }
        }
      }
    })

    this._timer = setInterval(this._onTimerFired, 5000)
    this._onTimerFired()
  }

  componentWillUnmount () {
    if (!isServerDetectionSupported) {
      return
    }

    const { onScanningStopped } = this.props
    if (onScanningStopped) {
      onScanningStopped()
    }

    if (this._timer !== undefined) {
      clearInterval(this._timer)
      this._timer = undefined
    }

    if (this._ssdpClient !== undefined) {
      this._ssdpClient = undefined
    }
  }

  @autobind
  _onTimerFired () {
    this._ssdpClient.search('urn:collmot-com:service:flockwave-sio:1')
  }

  render () {
    // Nothing to render; this is a component that works behind the scenes
    return null
  }
}

ServerDetectionManagerPresentation.propTypes = {
  onScanningStarted: PropTypes.func,
  onScanningStopped: PropTypes.func,
  onServerDetected: PropTypes.func,
  onServerHostnameResolved: PropTypes.func,
  onServerInferred: PropTypes.func
}

export const ServerDetectionManager = connect(
  // mapStateToProps
  state => ({
  }),
  // mapDispatchToProps
  dispatch => ({
    onScanningStarted () {
      dispatch(removeAllDetectedServers())
      dispatch(startScanning())
    },

    onScanningStopped () {
      dispatch(stopScanning())
    },

    onServerDetected (host, port) {
      const action = addDetectedServer(host, port)
      dispatch(action)
      return { key: action.key, wasAdded: !!action.wasAdded }
    },

    onServerHostnameResolved (key, name) {
      dispatch(updateDetectedServerLabel(key, name))
    },

    onServerInferred (host, port) {
      const action = addInferredServer(host, port)
      dispatch(action)
      return action.key
    }
  })
)(ServerDetectionManagerPresentation)