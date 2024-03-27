<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos INC
-->

<template lang='pug' src='./TgImportUS.pug'></template>

<script>
  // Import npm components
  import { mapState, mapMutations, mapActions } from 'vuex'

  // Import custom helpers, libraries or another functions
  import TgButton from '@/components/TgButton/TgButton'
  import TgNextStep from '@/components/TgNextStep/TgNextStep'

  import locales from '@/translations/translations'

  export default {
    name: 'TgImportUS',
    locales,
    components: {
      TgButton,
      TgNextStep
    },
    data () {
      return {
        userStories: [],
        numUs: 0,
        usSelected: [],
        page: 1,
        pagination: true,
        milestone: false,
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
        pendingStatusesSelected: []
      }
    },
    async created () {
      try {
        this.getProjectsFilters()

        if (this.getUserStories.length) {
          this.readUsSelected()
        }

        if (this.getTagsSelected.length) {
          this.pendingTagsSelected = this.getTagsSelected
          this.tagsSelected = this.getTagsSelected
        }

        if (this.getStatusesSelected.length) {
          this.pendingStatusesSelected = this.getStatusesSelected
          this.statusesSelected = this.getStatusesSelected
        }

        this.milestone = this.isMilestone
        if (!this.milestone) {
          this.getTaigaUs()
        }

        let listMilestone = await this.getListMilestoneUs({id: this.projectData.id})
        this.milestone_us = listMilestone
      } catch (error) {
        this.closeModal()
        this.notifyText({text: 'ERROR_TEXT', error: true})
        this.openModal('notify')
      }
    },
    mounted () {
      if (this.$refs.us) {
        this.$refs.us.addEventListener('scroll', (e) => {
          this.bottom = this.bottomVisible(e)
        }, false)
      }
    },
    computed: {
      ...mapState({
        projectData: state => state.game.projectData,
        getUserStories: state => state.game.userStories,
        isSelectAllUs: state => state.game.isSelectAllUs,
        getBacklog: state => state.game.isBacklogActivated,
        isMilestone: state => state.game.isMilestone,
        getTagsSelected: state => state.game.tagsSelected,
        getStatusesSelected: state => state.game.statusesSelected,
        getUnselectedUS: state => state.game.unselectedUS
      }),
      allUserStoriesSelected: {
        get () {
          if (this.getUnselectedUS.length) {
            return false
          }

          let usSelected = this.usSelected
          let userStories = this.userStories
          if (usSelected && userStories) {
            if (usSelected.length >= userStories.length && userStories.length > 0) {
              this.setSelectAllUs(true)
              return true
            }
          }

          this.setSelectAllUs(false)
          return false
        },
        set (value) {
          if (value) {
            this.selectAllTaigaUs()
            this.setSelectAllUs(true)
            return true
          }

          this.setSelectAllUs(false)
          this.usSelected = []
          return false
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
        this.setStepComplete(this.usSelected.length)
      },
      milestone (value) {
        this.setMilestone(value)
        this.resetParams()
        this.getTaigaUs()
        this.getProjectsFilters()
      },
      bottom (bottom) {
        if (bottom && (this.numUs > this.userStories.length)) {
          this.getTaigaUs()
        }
      }
    },
    methods: {
      ...mapActions({
        getListUserStories: 'game/getListUserStories',
        getListMilestoneUs: 'game/getProjectMilestoneUs',
        getUserStoriesFilters: 'game/getUserStoriesFilters'
      }),
      ...mapMutations({
        setUserStory: 'game/SET_USER_STORIES',
        setUnselectedUS: 'game/SET_UNSELECTED_US',
        setSelectAllUs: 'game/SET_SELECT_ALL_US',
        setStepComplete: 'step/SET_COMPLETE',
        setMilestone: 'game/SET_MILESTONE',
        setTagsSelected: 'game/SET_TAGS_SELECTED',
        setStatusesSelected: 'game/SET_STATUSES_SELECTED',
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
            milestone: this.isMilestone
          })
          this.tags = data.tags
          if (!this.getTagsSelected.length) {
            this.allTagsSelected = true
          } else {
            this.listFilterTag()
          }
          this.statuses = data.statuses
          if (!this.getStatusesSelected.length) {
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
        if (this.tagsSelected.length) {
          this.tagsSelectedList = this.tagsSelected.map(
            selected => this.tags.filter(
              tag => tag.name === selected
            )[0]
          )
        } else {
          this.tagsSelectedList = []
        }
      },
      listFilterStatus () {
        if (this.statusesSelected.length) {
          this.statusesSelectedList = this.statusesSelected.map(
            selected => this.statuses.filter(
              status => status.id === selected
            )[0]
          )
        } else {
          this.statusesSelectedList = []
        }
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
      async getTaigaUs () {
        try {
          this.spinner = true
          const data = await this.getListUserStories({
            fulldata: false,
            page: this.page,
            tagsSelected: this.getTagsSelected,
            statusesSelected: this.getStatusesSelected,
            milestone: this.isMilestone,
            pagination: this.pagination
          })

          const currentSelectedAll = this.allUserStoriesSelected
          this.numUs = Number(data.count)

          if (this.page > 1) {
            this.userStories = this.userStories.concat(data.items)
          } else {
            this.userStories = data.items
          }
          if (this.getUserStories.length && !currentSelectedAll) {
            this.readUsSelected()
          } else if (!this.usSelected.length || currentSelectedAll) {
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
      readUsSelected () {
        const formatList = this.mapUs(this.getUserStories)
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
      }
    }
  }
</script>

<style lang='css' src='./TgImportUS.css' scoped></style>
