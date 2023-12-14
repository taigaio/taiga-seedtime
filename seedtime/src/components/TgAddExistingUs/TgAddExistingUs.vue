<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos Ventures SL
-->

<template lang='pug' src='./TgAddExistingUs.pug'></template>

<script>
  // Import npm components
  import { mapState, mapMutations, mapActions } from 'vuex'

  // Import custom helpers, libraries or another functions
  import TgButton from '@/components/TgButton/TgButton'

  import locales from '@/translations/translations'

  export default {
    name: 'TgAddExistingUs',
    locales,
    components: {
      TgButton
    },
    data () {
      return {
        userStories: [],
        numUs: 0,
        usSelected: [],
        page: 1,
        pagination: true,
        milestone: true,
        milestone_us: 0,
        spinner: true,
        bottom: false,
        showTags: false,
        tags: [],
        tagsSelected: [],
        tagsSelectedList: [],
        pendingTagsSelected: [],
        showStatuses: false,
        statuses: [],
        statusesSelected: [],
        statusesSelectedList: [],
        pendingStatusesSelected: [],
        discards: true
      }
    },
    created () {
      this.setMilestoneSelected(true)
      this.setDiscardSelected(true)
      this.getProjectsFilters()
      this.getTaigaUs()
      this.getMilestoneList()
    },
    mounted () {
      this.$refs.us.addEventListener('scroll', (e) => {
        this.bottom = this.bottomVisible(e)
      }, false)
    },
    computed: {
      ...mapState({
        projectData: state => state.game.projectData,
        getUnselectedUS: state => state.game.unselectedUS,
        isSelectAllUs: state => state.game.isSelectAllUs,
        getBacklog: state => state.game.isBacklogActivated,
        getTagsSelected: state => state.game.tagsSelected,
        getStatusesSelected: state => state.game.statusesSelected,
        gameUs: state => state.game.gameUs,
        discard: state => state.game.discard
      }),
      allUserStoriesSelected: {
        get () {
          if (this.getUnselectedUS.length) {
            return false
          }

          if (this.usSelected.length >= this.userStories.length && this.userStories.length > 0) {
            this.setSelectAllUs(true)
            return true
          }

          this.setSelectAllUs(false)
          return false
        },
        set (value) {
          if (value) {
            this.selectAllTaigaUs()
            this.setSelectAllUs(true)
            return value
          }

          this.setSelectAllUs(false)
          this.usSelected = []
          return value
        }
      },
      totalUsSelected () {
        let current = this.usSelected.length
        if (this.allUserStoriesSelected) {
          current = this.numUs
        } else if (this.isSelectAllUs) {
          current = Math.abs(this.numUs - this.getUnselectedUS.length)
        }
        return current
      },
      allTagsSelected: {
        get () {
          if (this.tags.length) {
            return this.pendingTagsSelected.length === this.tags.length
          }

          return false
        },
        set (value) {
          if (value) {
            this.pendingTagsSelected = this.tags.map(item => item.name)
            return true
          }
          this.pendingTagsSelected = []
          return false
        }
      },
      allStatusesSelected: {
        get () {
          if (this.statuses.length) {
            return this.pendingStatusesSelected.length === this.statuses.length
          }

          return false
        },
        set (value) {
          if (value) {
            this.pendingStatusesSelected = this.statuses.map(item => item.id)
            return true
          }
          this.pendingStatusesSelected = []
          return false
        }
      },
      isDisabledStatusButton () {
        return !this.pendingStatusesSelected.length
      },
      isDisabledTagsButton () {
        return !this.pendingTagsSelected.length
      }
    },
    watch: {
      usSelected () {
        this.saveUsSelected()
      },
      milestone (value) {
        this.setMilestoneSelected(value)
        this.resetParams()
        this.getTaigaUs()
        this.getProjectsFilters()
      },
      discards (value) {
        this.setDiscardSelected(value)
        this.resetParams()
        this.getTaigaUs()
      },
      bottom (bottom) {
        if (bottom && (this.numUs > this.userStories.length)) {
          this.getTaigaUs()
        }
      },
      gameUs () {
        this.closeModal()
        this.notifyText({text: 'ADD_EXISTING_US_NOTIFY_SUCCESS', error: false})
        this.openModal('notify')
      }
    },
    methods: {
      ...mapActions({
        getListUserStories: 'game/getListUserStories',
        getListMilestoneUs: 'game/getProjectMilestoneUs',
        getUserStoriesFilters: 'game/getUserStoriesFilters',
        addExistingUs: 'game/addExistingUs'
      }),
      ...mapMutations({
        setUserStory: 'game/SET_USER_STORIES',
        setUnselectedUS: 'game/SET_UNSELECTED_US',
        setSelectAllUs: 'game/SET_SELECT_ALL_US',
        setMilestoneSelected: 'game/SET_MILESTONE',
        setTagsSelected: 'game/SET_TAGS_SELECTED',
        setStatusesSelected: 'game/SET_STATUSES_SELECTED',
        setDiscardSelected: 'game/SET_DISCARD_SELECTED',
        openModal: 'modal/OPEN_MODAL',
        closeModal: 'modal/CLOSE_MODAL',
        notifyText: 'modal/NOTIFY_TEXT'
      }),
      bottomVisible (e) {
        const scrollY = e.target.scrollTop
        if (scrollY > 1) {
          const visible = e.target.clientHeight
          const pageHeight = e.target.scrollHeight
          const bottomOfPage = visible + scrollY >= pageHeight
          return bottomOfPage
        }
        return false
      },
      resetParams () {
        this.page = 1
      },
      async getProjectsFilters () {
        try {
          const data = await this.getUserStoriesFilters({
            projectId: this.projectData.id,
            milestone: this.milestone
          })

          this.tags = data.tags
          if (!this.tagsSelected.length) {
            this.allTagsSelected = true
          } else {
            this.listFilterTag()
          }
          this.statuses = data.statuses
          if (!this.statusesSelected.length) {
            this.allStatusesSelected = true
          } else {
            this.listFilterStatus()
          }
        } catch (error) {
          this.closeModal()
          this.notifyText({text: 'ERROR_TEXT', error: true})
          this.openModal('notify')
        }
      },
      showStatusesModal () {
        this.showTags = false
        this.showStatuses = !this.showStatuses
        if (!this.statusesSelected.length) {
          this.allStatusesSelected = true
        }
      },
      showTagsModal () {
        this.showStatuses = false
        this.showTags = !this.showTags
        if (!this.tagsSelected.length) {
          this.allTagsSelected = true
        }
      },
      saveTags () {
        this.tagsSelected = this.pendingTagsSelected
        this.setTagsSelected(this.tagsSelected)
        this.listFilterTag()
        this.resetParams()
        this.getTaigaUs()
        this.showTags = false
      },
      saveStatuses () {
        this.statusesSelected = this.pendingStatusesSelected
        this.setStatusesSelected(this.statusesSelected)
        this.listFilterStatus()
        this.resetParams()
        this.getTaigaUs()
        this.showStatuses = false
      },
      listFilterTag () {
        this.tagsSelectedList = this.tagsSelected.map(
          selected => this.tags.filter(
            tag => tag.name === selected
          )[0]
        )
      },
      listFilterStatus () {
        this.statusesSelectedList = this.statusesSelected.map(
          selected => this.statuses.filter(
            status => status.id === selected
          )[0]
        )
      },
      removeAllFilters () {
        this.resetParams()
        this.tagsSelected = []
        this.statusesSelected = []
        this.pendingTagsSelected = []
        this.pendingStatusesSelected = []
        this.setStatusesSelected(this.statusesSelected)
        this.setTagsSelected(this.tagsSelected)
        this.listFilterTag()
        this.listFilterStatus()
        this.getTaigaUs()
      },
      removeFilterTag (name) {
        this.resetParams()
        this.tagsSelected = this.tagsSelected.filter(tag => tag !== name)
        this.pendingTagsSelected = this.tagsSelected
        this.setTagsSelected(this.tagsSelected)
        this.listFilterTag()
        this.getTaigaUs()
      },
      removeFilterStatus (id) {
        this.resetParams()
        this.statusesSelected = this.statusesSelected.filter(status => status !== id)
        this.pendingStatusesSelected = this.statusesSelected
        this.setStatusesSelected(this.statusesSelected)
        this.listFilterStatus()
        this.getTaigaUs()
      },
      async getMilestoneList () {
        try {
          const listMilestone = await this.getListMilestoneUs({id: this.projectData.id, isGame: true})
          this.milestone_us = listMilestone
        } catch (error) {
          this.closeModal()
          this.notifyText({text: 'ERROR_TEXT', error: true})
          this.openModal('notify')
        }
      },
      async getTaigaUs () {
        try {
          this.spinner = true
          const data = await this.getListUserStories({
            fulldata: false,
            page: this.page,
            tagsSelected: this.tagsSelected,
            statusesSelected: this.statusesSelected,
            milestone: this.milestone,
            pagination: this.pagination,
            currentGame: true,
            discard: this.discards
          })

          this.numUs = Number(data.count)

          if (this.page > 1) {
            this.userStories = this.userStories.concat(data.items)
          } else {
            this.userStories = data.items
          }

          if (this.userStories.length || this.allUserStoriesSelected) {
            this.selectAllTaigaUs()
          }

          if (this.numUs > this.userStories.length) {
            this.page++
          } else {
            this.page = 1
          }

          this.spinner = false
        } catch (error) {
          this.closeModal()
          this.notifyText({text: 'ERROR_TEXT', error: true})
          this.openModal('notify')
        }
      },
      mapUs (usList) {
        let formatList = []
        usList.map(item => {
          formatList.push(item.id)
        })
        return formatList
      },
      selectAllTaigaUs () {
        const formatList = this.mapUs(this.userStories)
        this.usSelected = formatList
        this.setUnselectedUS([])
      },
      saveUsSelected () {
        let usList = []
        const unselected = this.mapUs(this.userStories)
        this.usSelected.map(id => {
          usList.push({id})
          const index = unselected.findIndex(item => {
            return item === id
          })
          if (index >= 0) {
            unselected.splice(index, 1)
          }
        })
        this.setUserStory(usList)
        this.setUnselectedUS(unselected)
      },
      disabled () {
        return this.usSelected.length
      },
      addToDeck () {
        try {
          this.addExistingUs()
        } catch (error) {
          this.closeModal()
          this.notifyText({text: 'ERROR_TEXT', error: true})
          this.openModal('notify')
        }
      }
    }
  }
</script>

<style lang='css' src='./TgAddExistingUs.css' scoped></style>
