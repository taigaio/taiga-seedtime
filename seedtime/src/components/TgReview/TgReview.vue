<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos INC
-->

<template lang='pug' src='./TgReview.pug'></template>

<script>
  import Vue from 'vue'
  import { mapState } from 'vuex'

  import TgNextStep from '@/components/TgNextStep/TgNextStep'

  import locales from '@/translations/translations'

  export default {
    name: 'TgReview',
    locales,
    components: {
      TgNextStep
    },
    data () {
      return {
        copied: false,
        baseUrl: Vue.config.estimations.BASE_URL
      }
    },
    computed: {
      ...mapState({
        projectData: state => state.game.projectData,
        name: state => state.game.name,
        scale: state => state.game.scale,
        roles: state => state.game.roles,
        uuid: state => state.game.uuid
      }),
      gameUrl () {
        return `${this.baseUrl}game/${this.projectData.slug}/${this.uuid}`
      }
    },
    methods: {
      copy () {
        this.$refs.copyLink.select()
        document.execCommand('copy')
        this.copied = true
        setTimeout(() => {
          this.copied = false
        }, 2000)
      }
    }
  }
</script>

<style lang='css' src='./TgReview.css' scoped></style>
