<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos Ventures SL
-->

<script>
  import Vue from 'vue'
  import session from '@/api/session'
  import { authService } from '@/api'

  export default {
    name: 'TgEvents',
    data () {
      return {
        sessionId: session.get(),
        ws: undefined,
        connected: false,
        error: false,
        subscriptions: [],
        pendingMessages: [],
        heartbeatInterval: null,
        missedHeartbeats: 0
      }
    },
    props: {
      subscribeTo: {
        type: Array,
        required: true
      }
    },
    created () {
      this.setupConnection()
    },
    render () {
      return undefined
    },
    methods: {
      setupConnection () {
        if (!window.WebSocket) {
          console.warn('[TgEvents] WebSockets not supported on your browser.')
          return false
        }
        this.stopExistingConnection()

        const url = Vue.config.estimations.TAIGA_EVENTS_URL

        // This allows disable events in case
        // url is not found on the configuration.
        if (!url) {
          return false
        }

        this.error = false
        this.ws = new window.WebSocket(url)
        this.ws.addEventListener('open', this.onOpen)
        this.ws.addEventListener('message', this.onMessage)
        this.ws.addEventListener('error', this.onError)
        this.ws.addEventListener('close', this.onClose)
        return true
      },
      stopExistingConnection () {
        if (!this.ws) {
          return false
        }

        this.subscriptions.forEach((routingKey) => {
          this.unsubscribe(routingKey)
        })

        this.ws.removeEventListener('open', this.onOpen)
        this.ws.removeEventListener('close', this.onClose)
        this.ws.removeEventListener('error', this.onError)
        this.ws.removeEventListener('message', this.onMessage)
        this.stopHeartBeatMessages()
        this.ws.close()
        this.ws = undefined
        return true
      },
      // ////////////////////////////////////////////
      // Event listeners
      // ////////////////////////////////////////////
      onOpen () {
        console.info('[TgEvents] WebSocket connection opened')
        this.connected = true
        const message = {
          cmd: 'auth',
          data: {
            token: authService.token.get(),
            sessionId: this.sessionId
          }
        }
        this.sendMessage(message)
        this.startHeartBeatMessages()

        this.subscribeTo.forEach((routingKey) => {
          this.subscribe(routingKey)
        })
      },
      onMessage (event) {
        const data = JSON.parse(event.data)
        if (data.cmd === 'pong') {
          return this.processHeartBeatPongMessage(data)
        }
        if (data.session_id !== this.sessionId) {
          return this.processMessage(data)
        }
        return false
      },
      onError (error) {
        console.error(`[TgEvents] WebSocket error: ${error}`)
        this.error = true
        setTimeout(this.setupConnection, Vue.config.estimations.TAIGA_EVENTS_RECONNECT_TRY_INTERVAL)
      },
      onClose () {
        console.info('[TgEvents] WebSocket closed.')
        this.connected = false
        this.stopHeartBeatMessages()
        setTimeout(this.setupConnection, Vue.config.estimations.TAIGA_EVENTS_RECONNECT_TRY_INTERVAL)
      },
      // ////////////////////////////////////////////
      // Subscriptions
      // ////////////////////////////////////////////
      subscribe (routingKey) {
        if (this.error) {
          return false
        }

        console.info(`%c[TgEvents] Subscribe to #${routingKey}`, 'color: green')

        const message = {
          cmd: 'subscribe',
          routing_key: routingKey
        }

        this.subscriptions.push(routingKey)
        this.sendMessage(message)
        return true
      },
      unsubscribe (routingKey) {
        if (this.error) {
          return false
        }

        console.info(`%c[TgEvents] Unsubscribe from #${routingKey}`, 'color: red')

        this.subscriptions = this.subscriptions.filter(item => item === routingKey)

        const message = {
          cmd: 'unsubscribe',
          routing_key: routingKey
        }

        this.sendMessage(message)
        return true
      },
      // ////////////////////////////////////////////
      // Messages
      // ////////////////////////////////////////////
      sendMessage (message) {
        this.pendingMessages.push(message)

        if (!this.connected) {
          return false
        }

        const messages = this.pendingMessages.map(JSON.stringify)
        this.pendingMessages = []

        messages.forEach((msg) => {
          this.ws.send(msg)
        })
        return true
      },
      processMessage (data) {
        const routingKey = data.routing_key
        console.info(`[TgEvents] Process #${routingKey} event: `, data.data.pk)
        this.$emit('process-events-message', routingKey, data.data)
        return true
      },
      // ////////////////////////////////////////////
      // Heartbeat (Ping - Pong)
      // ////////////////////////////////////////////
      // See  RFC https://tools.ietf.org/html/rfc6455#section-5.5.2
      //      RFC https://tools.ietf.org/html/rfc6455#section-5.5.3
      startHeartBeatMessages () {
        if (this.heartbeatInterval) {
          return false
        }

        this.missedHeartbeats = 0
        this.heartbeatInterval = setInterval(() => {
          try {
            if (this.missedHeartbeats >= Vue.config.estimations.TAIGA_EVENTS_MAX_MISSED_HEARTBEATS) {
              throw new Error('[TgEvents][Heartbeat] Too many missed heartbeats PINGs.')
            }
            this.missedHeartbeats = this.missedHeartbeats + 1
            this.sendMessage({cmd: 'ping'})
            // console.log('%c[TgEvents][Heartbeat] Send PING.', 'color: silver')
          } catch (e) {
            console.error(`%c[TgEvents][HeartBeat] Error: ${e.message}`, 'color: silver')
          }
        }, Vue.config.estimations.TAIGA_EVENTS_HEARTBEAT_INTERVAL_TIME)

        console.info('%c[TgEvents][HeartBeat] Enabled.', 'color: LightGreen')
        return true
      },
      stopHeartBeatMessages () {
        if (!this.heartbeatInterval) {
          return false
        }
        clearInterval(this.heartbeatInterval)
        this.heartbeatInterval = null
        console.info('%c[TgEvents][HeartBeat] Disabled.', 'color: LightPink')
        return true
      },
      processHeartBeatPongMessage (data) {
        this.missedHeartbeats = 0
        // console.log('%c[TgEvents][Heartbeat] Recived PONG.', 'color: silver')
        return true
      }
    }
  }
</script>
