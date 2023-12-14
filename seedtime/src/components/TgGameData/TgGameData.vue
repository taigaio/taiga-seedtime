<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos Ventures SL
-->

<template lang='pug' src='./TgGameData.pug'></template>

<script>

  import { mapState, mapActions, mapMutations } from 'vuex'

  import locales from '@/translations/translations'

  import TgNextStep from '@/components/TgNextStep/TgNextStep'

  export default {
    name: 'TgGameData',
    locales,
    components: {
      TgNextStep
    },
    data () {
      return {
        gameName: undefined,
        selectScaleType: 'tshirts',
        scales: {
          tshirts: [
            { id: 0, name: 'XS', order: 1 },
            { id: 1, name: 'S', order: 2 },
            { id: 2, name: 'M', order: 3 },
            { id: 3, name: 'L', order: 4 },
            { id: 4, name: 'XL', order: 5 },
            { id: 5, name: 'XXL', order: 6 }
          ],
          taiga: []
        },
        scalesSelected: [],
        roles: [],
        rolesSelected: []
      }
    },
    created () {
      this.setProjectDetails()
    },
    computed: {
      ...mapState({
        projectData: state => state.game.projectData,
        name: state => state.game.name,
        scale: state => state.game.scale,
        scaleType: state => state.game.scaleType,
        role: state => state.game.roles
      }),
      scalesTypes () {
        return Object.keys(this.scales)
      },
      allScalesSelected: {
        get () {
          const SCALE_TYPE_SELECTED = this.scales[this.selectScaleType]
          if (SCALE_TYPE_SELECTED.length) {
            return this.scalesSelected.length === SCALE_TYPE_SELECTED.length
          }

          return false
        },
        set (value) {
          if (value) {
            const SCALE_TYPE_SELECTED = this.scales[this.selectScaleType]
            this.scalesSelected = SCALE_TYPE_SELECTED
            return true
          }

          this.saveScalesOrdered([])
          this.scalesSelected = []
          return false
        }
      },
      allRolesSelected: {
        get () {
          if (this.roles.length) {
            return this.rolesSelected.length === this.roles.length
          }

          return false
        },
        set (value) {
          if (value) {
            this.rolesSelected = this.roles
            return true
          }

          this.rolesSelected = []
          return false
        }
      }
    },
    watch: {
      gameName (newGameName) {
        this.setName(newGameName)
        this.setComplete()
      },
      async scalesSelected (newScaleSelected) {
        try {
          await this.saveScalesOrdered(newScaleSelected)
          await this.setScaleType(this.selectScaleType)
          this.setComplete()
        } catch (error) {
          console.error(error)
        }
      },
      async rolesSelected (newRoleSelected) {
        try {
          this.saveRolesOrdered(newRoleSelected)
          this.setComplete()
        } catch (error) {
          console.error(error)
        }
      }
    },
    methods: {
      ...mapActions({
        getProjectDetails: 'game/getProjectDetails',
        saveRolesOrdered: 'game/saveRolesOrdered',
        saveScalesOrdered: 'game/saveScalesOrdered'
      }),
      ...mapMutations({
        setName: 'game/SET_NAME',
        setScaleType: 'game/SET_SCALE_TYPE',
        setStepComplete: 'step/SET_COMPLETE',
        setBacklog: 'game/SAVE_BACKLOG',
        openModal: 'modal/OPEN_MODAL',
        closeModal: 'modal/CLOSE_MODAL',
        notifyText: 'modal/NOTIFY_TEXT'
      }),
      async setProjectDetails () {
        try {
          const list = await this.getProjectDetails(this.projectData.slug)

          this.gameName = this.name
          this.scalesSelected = this.scale
          this.selectScaleType = this.scaleType
          this.scales.taiga = list.points
          this.roles = list.roles
          this.rolesSelected = this.role
          this.setBacklog(list.is_backlog_activated)

          if (!this.scalesSelected.length) {
            this.allScalesSelected = true
          }
        } catch (error) {
          this.closeModal()
          this.notifyText({text: 'PROJECT_NOT_FOUND', error: true})
          this.openModal('notify')
          this.$router.push({name: 'intro'})
        }
      },
      clearSelectedScales () {
        this.allScalesSelected = false
      },
      setComplete () {
        const HAS_NAME = this.name
        const HAS_SCALES = this.scale.length
        const HAS_SCALE_TYPE = this.scaleType.length
        if (HAS_NAME && HAS_SCALES && HAS_SCALE_TYPE) {
          return this.setStepComplete(true)
        }

        return this.setStepComplete(false)
      }
    }
  }
</script>

<style lang='css' src='./TgGameData.css' scoped></style>
