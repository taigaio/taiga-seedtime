<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos INC
-->

<template lang='pug' src='./TgSetup.pug'></template>

<script>
  export default {
    name: 'TgSetup',
    data () {
      return {
        classStep: undefined
      }
    },
    created () {
      this.classStep = this.$router.currentRoute.name
    },
    updated () {
      this.classStep = this.$router.currentRoute.name
    }
  }
</script>

<style lang='css'>
  html,
  body {
    height: 100%;
    margin: 0;
    min-height: 100%;
    overflow-y: auto !important;
  }

  body {
    display: flex;
    flex-direction: column;
  }
</style>

<style lang='css' src='./TgSetup.css' scoped></style>
