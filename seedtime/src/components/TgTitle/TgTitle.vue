<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos Ventures SL
-->

<template lang='pug' src='./TgTitle.pug'></template>

<script>
  import TgSteps from '@/components/TgSteps/TgSteps'

  export default {
    name: 'TgTitle',
    components: {
      TgSteps
    },
    props: {
      title: {
        type: String,
        required: true
      }
    }
  }
</script>

<style lang='css' src='./TgTitle.css' scoped></style>
