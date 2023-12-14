<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos Ventures SL
-->

<template lang='pug' src='./TgModals.pug'></template>

<script>
  import { mapState } from 'vuex'

  import TgModal from '@/components/TgModal/TgModal'
  import TgAddUs from '@/components/TgAddUs/TgAddUs'
  import TgAddExistingUs from '@/components/TgAddExistingUs/TgAddExistingUs'
  import TgUsDetails from '@/components/TgUsDetails/TgUsDetails'
  import TgSearchUs from '@/components/TgSearchUs/TgSearchUs'
  import TgNotify from '@/components/TgNotify/TgNotify'

  export default {
    name: 'TgModals',
    components: {
      TgModal,
      TgAddUs,
      TgAddExistingUs,
      TgUsDetails,
      TgSearchUs,
      TgNotify
    },
    computed: {
      ...mapState({
        searchModal: state => state.modal.search,
        notifyModal: state => state.modal.notify
      })
    }
  }
</script>
