import { Requester } from '@chainlink/ea-bootstrap'
import { Config } from '@chainlink/types'

export const NAME = 'TRUEUSD'

export const DEFAULT_ENDPOINT = 'trueusd'
export const DEFAULT_BASE_URL = 'https://api.real-time-attest.trustexplorer.io'

export const makeConfig = (prefix?: string): Config => {
  const config = Requester.getDefaultConfig(prefix)
  config.api.baseURL = config.api.baseURL || DEFAULT_BASE_URL
  config.defaultEndpoint = DEFAULT_ENDPOINT
  return config
}
