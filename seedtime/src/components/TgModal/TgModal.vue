<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos INC
-->

<template lang='pug' src='./TgModal.pug'></template>

<script>
  import { mapState, mapMutations } from 'vuex'

  // Import components to use in layout

  // Import custom helpers, libraries or another functions

  export default {
    name: 'TgModal',
    props: {
      name: {
        type: String,
        required: true
      }
    },
    computed: {
      ...mapState({
        current: state => state.modal.current
      })
    },
    methods: {
      ...mapMutations({
        closeModal: 'modal/CLOSE_MODAL'
      }),
      showModal () {
        if (!this.current) {
          return false
        }
        return this.name.toLowerCase() === this.current.toLowerCase()
      }
    }
  }
</script>

<style lang='css' src='./TgModal.css' scoped></style>
