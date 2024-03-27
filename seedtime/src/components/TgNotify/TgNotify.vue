<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos INC
-->

<template lang='pug' src='./TgNotify.pug'></template>

<script>
  import { mapState, mapMutations } from 'vuex'
  import TgButton from '@/components/TgButton/TgButton'

  import locales from '@/translations/translations'

  export default {
    name: 'TgNotify',
    locales,
    components: {
      TgButton
    },
    created () {
      setTimeout(() => {
        if (this.current === 'notify') {
          this.close()
        }
      }, 3000)
    },
    computed: {
      ...mapState({
        current: state => state.modal.current,
        notifyText: state => state.modal.notifyText,
        notifyError: state => state.modal.notifyError
      })
    },
    methods: {
      ...mapMutations({
        closeModal: 'modal/CLOSE_MODAL'
      }),
      close () {
        this.closeModal()
      }
    }
  }
</script>

<style lang='css' src='./TgNotify.css' scoped></style>
