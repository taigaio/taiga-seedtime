<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos INC
-->

<template lang='pug' src='./TgSteps.pug'></template>

<script>
  import { mapState } from 'vuex'

  import TgButton from '@/components/TgButton/TgButton'

  export default {
    name: 'TgSteps',
    components: {
      TgButton
    },
    computed: {
      ...mapState({
        current: state => state.step.current,
        total: state => state.step.total
      })
    },
    methods: {
      isDisabled (item) {
        // Disable current, and next items
        return this.current < item
      },
      isActive (item) {
        return this.current >= item
      }
    }
  }
</script>

<style lang='css' src='./TgSteps.css' scoped></style>
