import { Requester, util, Validator } from '@chainlink/ea-bootstrap'
import { ExecuteWithConfig } from '@chainlink/types'
import { Config } from '../../../config'

export const NAME = 'scores'

const customParams = {
  season: true,
}

export const execute: ExecuteWithConfig<Config> = async (request, _, config) => {
  const validator = new Validator(request, customParams)

  const jobRunID = validator.validated.id
  const season = validator.validated.data.season
  const url = util.buildUrlPath('/nfl/scores/json/Scores/:season', { season })

  const params = {
    key: config.nflScoresKey,
  }

  const options = { ...config.api, params, url }

  const response = await Requester.request(options)
  response.data.result = response.data

  return Requester.success(jobRunID, response, config.verbose)
}
