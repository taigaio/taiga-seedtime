###
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2021-present Kaleidos Ventures SL
###

module = angular.module('seedtime')

class EstimateService
    @.$inject = ["$q", "$tgHttp", "$tgConfig", "tgProjectService"]

    constructor: (@q, @http, @config, @projectService) ->
        @.projectEstimates = {}

    getAPIURL: ->
        return @config.get("api", "http://localhost:8000/api/v1/")

    fetchEstimates: (params) ->
        project = @projectService.project.toJS()
        url = "#{@.getAPIURL()}seedtime/estimates"
        @http.get(url, _.merge({project: project.id}, params || {})).then (response) ->
            return _.keyBy(response.data, 'userstory')

    getEstimate: (usId) ->
        @fetchEstimates({userstory: usId}).then (estimates) -> estimates[usId]

    getEstimates: () ->
        @fetchEstimates().then (estimates) -> estimates

module.service("ContribSeedtimeEstimateService", EstimateService)
