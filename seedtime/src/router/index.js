/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

// Dependencies
import Vue from 'vue'
import Router from 'vue-router'

import { authService } from '@/api'
import store from '@/store'
import hooks from './hooks'

// Components
import TgLogin from '@/containers/TgLogin/TgLogin'
import TgIntro from '@/containers/TgIntro/TgIntro'
import TgSetup from '@/containers/TgSetup/TgSetup'
import TgGame from '@/containers/TgGame/TgGame'
import TgRules from '@/containers/TgRules/TgRules'
import TgSetupSelectProject from '@/containers/TgSetupSelectProject/TgSetupSelectProject'
import TgSetupGameData from '@/containers/TgSetupGameData/TgSetupGameData'
import TgSetupSelectUserStories from '@/containers/TgSetupSelectUserStories/TgSetupSelectUserStories'
import TgSetupGameReview from '@/containers/TgSetupGameReview/TgSetupGameReview'
import TgBoard from '@/containers/TgBoard/TgBoard'
import TgModals from '@/containers/TgModals/TgModals'
import TgSummary from '@/containers/TgSummary/TgSummary'

import TgLogo from '@/components/TgLogo/TgLogo'
import TgBackButton from '@/components/TgBackButton/TgBackButton'
import TgUser from '@/components/TgUser/TgUser'
import TgEstimate from '@/components/TgEstimate/TgEstimate'
import TgGameActions from '@/components/TgGameActions/TgGameActions'

import TgNotFound from '@/containers/TgNotFound/TgNotFound'
import TgPermissions from '@/containers/TgPermissions/TgPermissions'
import TgGameNavigation from '@/components/TgGameNavigation/TgGameNavigation'

Vue.use(Router)

const ROUTER = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: TgLogin,
      props: (route) => ({
        authCode: route.query.auth_code,
        notFound: route.query.not_found,
        next: route.query.next
      })
    },
    {
      path: '/',
      component: TgSetup,
      meta: { requireAuth: true },
      children: [
        {
          path: 'intro',
          name: 'intro',
          components: {
            headerLeft: TgLogo,
            default: TgIntro
          }
        },
        {
          path: 'rules',
          name: 'rules',
          components: {
            headerLeft: TgLogo,
            headerRight: TgBackButton,
            default: TgRules
          }
        },
        {
          path: 'setup/select-project',
          name: 'setupSelectProject',
          components: {
            headerLeft: TgLogo,
            headerRight: TgUser,
            default: TgSetupSelectProject,
            modals: TgModals
          },
          beforeEnter (to, from, next) {
            store.commit('game/RESET_GAME')
            store.commit('step/RESET_STEPS')
            return next()
          }
        },
        {
          path: 'setup/game-data',
          name: 'setupGameData',
          components: {
            headerLeft: TgLogo,
            headerRight: TgUser,
            default: TgSetupGameData,
            modals: TgModals
          },
          beforeEnter (to, from, next) {
            store.commit('step/SET_STEP', 2)
            return next()
          }
        },
        {
          path: 'setup/select-user-stories',
          name: 'setupSelectUserStories',
          components: {
            headerLeft: TgLogo,
            headerRight: TgUser,
            default: TgSetupSelectUserStories,
            modals: TgModals
          },
          beforeEnter (to, from, next) {
            store.commit('step/SET_STEP', 3)
            return next()
          }
        },
        {
          path: 'setup/game-review',
          name: 'setupGameReview',
          components: {
            headerLeft: TgLogo,
            headerRight: TgUser,
            default: TgSetupGameReview,
            modals: TgModals
          },
          async beforeEnter (to, from, next) {
            try {
              const newGame = await store.dispatch('game/createGame')
              store.commit('game/SET_GAME_UUID', newGame.uuid)
              store.commit('step/SET_STEP', 4)
              return next()
            } catch (error) {
              store.commit('modal/CLOSE_MODAL')
              store.commit('modal/NOTIFY_TEXT', { text: 'ERROR_TEXT', error: true })
              store.commit('modal/OPEN_MODAL')
              return next('setup/select-user-stories')
            }
          }
        }
      ]
    },
    {
      path: '/game',
      component: TgGame,
      meta: { requireAuth: true },
      children: [
        {
          path: ':projectSlug/:gameUUID',
          name: 'play',
          async beforeEnter (to, from, next) {
            if (store.state.game.showRules) {
              store.commit('game/SET_SHOW_RULES', false)
            }

            if (from.name !== 'summary') {
              // summary = true
              try {
                await store.dispatch('game/getGame', {...to.params, reset: true})
                await store.dispatch('game/generateUserStories')
                store.commit('game/FILL_SCALES_WITH_USER_STORIES')

                document.title = `${Vue.config.estimations.TITLE} | ${store.state.game.name}`
              } catch (error) {
                store.commit('modal/CLOSE_MODAL')
                store.commit('modal/NOTIFY_TEXT', { text: 'ERROR_TEXT', error: true })
                store.commit('modal/OPEN_MODAL')
                return next('/intro')
              }
            }

            return next()
          },
          components: {
            headerLeft: TgLogo,
            headerCenter: TgGameActions,
            headerRight: TgUser,
            navTab: TgGameNavigation,
            default: TgBoard,
            footer: TgEstimate,
            modals: TgModals
          },
          props: {
            headerLeft: {
              isGame: true
            }
          }
        },
        {
          path: ':projectSlug/:gameUUID/summary',
          name: 'summary',
          async beforeEnter (to, from, next) {
            if (store.state.game.showRules) {
              store.commit('game/SET_SHOW_RULES', false)
            }

            if (from.name !== 'play') {
              try {
                await store.dispatch('game/getGame', {...to.params})
                await store.dispatch('game/generateUserStories')
                store.commit('game/FILL_SCALES_WITH_USER_STORIES')

                document.title = `${Vue.config.estimations.TITLE} | ${store.state.game.name}`
              } catch (error) {
                store.commit('modal/CLOSE_MODAL')
                store.commit('modal/NOTIFY_TEXT', { text: 'ERROR_TEXT', error: true })
                store.commit('modal/OPEN_MODAL')
                return next('/intro')
              }
            }

            return next()
          },
          components: {
            headerLeft: TgLogo,
            headerRight: TgUser,
            navTab: TgGameNavigation,
            default: TgSummary
          },
          props: {
            headerLeft: {
              isGame: true
            }
          }
        }
      ]
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter (to, from, next) {
        authService.logout()
        return next('/')
      }
    },
    {
      path: '/no-permissions',
      name: 'permissions',
      component: TgPermissions
    },
    {
      path: '/not-found',
      name: '404',
      component: TgNotFound
    },
    {
      path: '*',
      redirect: { name: '404' }
    }
  ]
})

hooks(ROUTER)

export default ROUTER
