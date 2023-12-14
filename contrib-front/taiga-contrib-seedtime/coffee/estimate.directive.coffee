###
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2021-present Kaleidos Ventures SL
###

module = angular.module('seedtime')

SeedtimeDirective = ($rootScope, $config, $template, $translate, $estimateService) ->
    templatesPath = 'compile-modules/taiga-contrib-seedtime/partials'
    seedTimeURL = $config.get("seedTimeUrl", "http://localhost:8080")

    kanbanSignals = ['kanban:userstories:loaded']
    kanbanUserStoryStatus = {}

    backlogSignals = ['backlog:userstories:loaded','sprint:us:move']
    backlogEstimatesHeaderLoaded = false

    taskboardSignals = ['taskboard:userstories:loaded']

    usDetailSignals = ['userstory:loaded']

    scopeDefer = (scope, func) ->
        _.defer -> scope.$apply(func)

    link = (scope, el, attrs, ctrl) ->
        for signal in kanbanSignals
            $rootScope.$on signal, (ctx, userstories, newStatus) =>
                scopeDefer scope, => renderKanbanEstimates(userstories, newStatus)

        for signal in backlogSignals
            $rootScope.$on signal, () =>
                scopeDefer scope, => renderBacklogEstimates()

        for signal in taskboardSignals
            $rootScope.$on signal, (ctx, userstories) =>
                scopeDefer scope, => renderTaskboardEstimates(userstories)

        for signal in usDetailSignals
            $rootScope.$on signal, (ctx, us) =>
                scopeDefer scope, => renderUserStoryEstimate(us)

        render = (templateName, estimate) ->
            template = $template.get("#{templatesPath}/#{templateName}.html", true)
            gameUrl =  "#{seedTimeURL}game/#{estimate.project_slug}/#{estimate.game}"
            html = template({estimateValue: estimate.estimate_value, gameUrl: gameUrl})
            return html

        renderKanbanEstimates = (userstories) =>
            kanbanSlots = el.find('.card .card-estimation')
            appendEstimates(userstories, kanbanSlots)

        renderBacklogEstimates = () ->
            $estimateService.getEstimates().then (estimates) ->
                return if !_.size(estimates)

                backlogSlots = el.find('.us-item-row')
                for slot in backlogSlots
                    usId = $(slot).data('id')
                    estimate = estimates[usId]
                    estimateValue = estimate?.estimate_value || ''
                    if ($(slot).find('.seedtime-points')[0])
                        $(slot).find('.seedtime-points')[0].innerHTML = estimateValue
                    else
                        estimateCell = document.createElement('div')
                        estimateCell.className = 'seedtime-points'
                        estimateCell.innerHTML= estimateValue
                        slot.insertBefore(estimateCell, slot.children[slot.children.length - 1])

                backlogEstimatesHeader = el.find('.backlog-table-header .seedtime-points')
                if (!backlogEstimatesHeader.length)
                    slot = el.find('.backlog-table-header .backlog-table-title .points')
                    slot[0].outerHTML += render('seedtime-backlog-table-title', '')


        renderTaskboardEstimates = (userstories) ->
            taskboardSlots = el.find('.taskboard-row .points-value')
            appendEstimates(userstories, taskboardSlots)

        renderUserStoryEstimate = (us) ->
            $estimateService.getEstimate(us.id).then (estimate) =>
                return if !estimate

                slot = el.find('.points-per-role')
                $(slot).css('margin-bottom', '10px')
                $(slot)[0].outerHTML += render('seedtime-label', estimate || '')

        appendEstimates = (userstories, slots) ->
            $estimateService.getEstimates().then (estimates) =>
                for slot in slots
                    usId = $(slot).data('id')
                    estimate = estimates[usId]
                    us = _.find(userstories, {id: usId})
                    continue if !estimate || !us

                    appendEstimate(us, slot, estimate)

        appendEstimate = (us, slot, estimate) ->
            seedtimePointsHtml = render('seedtime-inline', estimate || '')

            if (us.total_points)
                slot.innerHTML = $translate.instant('COMMON.FIELDS.POINTS') + ' ' + us.total_points + seedtimePointsHtml
            else
                slot.innerHTML = seedtimePointsHtml

    return {
        scope: {},
        link: link
    }

SeedtimeDirective.$inject = [
    '$rootScope'
    '$tgConfig'
    '$tgTemplate'
    '$translate'
    'ContribSeedtimeEstimateService'
]

module.directive('body', SeedtimeDirective)
