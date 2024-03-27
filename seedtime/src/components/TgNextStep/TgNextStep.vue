<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos INC
-->

<template lang='pug' src='./TgNextStep.pug'></template>

<script>
  import { mapState } from 'vuex'

  import locales from '@/translations/translations'

  export default {
    name: 'TgNextStep',
    locales,
    data: () => {
      return {
        setup_steps: [
          'setupSelectProject',
          'setupGameData',
          'setupSelectUserStories',
          'setupGameReview',
          'play'
        ],
        params: {}
      }
    },
    computed: {
      ...mapState({
        current: state => state.step.current,
        total: state => state.step.total,
        isComplete: state => state.step.complete,
        getProjectData: state => state.game.projectData,
        getGameUUID: state => state.game.uuid
      }),
      fordwardLink () {
        if (this.current === this.total) {
          this.params = {
            projectSlug: this.getProjectData.slug,
            gameUUID: this.getGameUUID
          }
        }
        return this.setup_steps[this.current]
      },
      backwardLink () {
        return this.setup_steps[this.current - 2]
      },
      isDisabled () {
        if (this.current >= this.total) {
          return false
        }

        return !this.isComplete
      }
    }
  }
</script>

<style lang='css' src='./TgNextStep.css' scoped></style>
