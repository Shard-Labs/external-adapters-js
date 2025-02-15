import { Requester, Validator, AdapterError } from '@chainlink/ea-bootstrap'
import { ExecuteWithConfig, Config, InputParameters } from '@chainlink/types'
import { NAME as ADAPTER_NAME } from '../config'

export const NAME = 'price'

const customError = (data: ResponseSchema[]) => data.length === 0

export const supportedEndpoints = ['price']

export const inputParameters: InputParameters = {
  base: {
    aliases: ['from', 'coin'],
    description: 'The symbol of the currency to query',
    required: true,
    type: 'string',
  },
  quote: {
    aliases: ['to', 'market'],
    description: 'The symbol of the currency to convert to',
    required: true,
    type: 'string',
  },
}

export interface ResponseSchema {
  symbol: string
  baseAssetName: string
  quoteAssetName: string
  priceChange: string
  priceChangePercent: string
  prevClosePrice: string
  lastPrice: string
  lastQuantity: string
  openPrice: string
  highPrice: string
  lowPrice: string
  openTime: number
  closeTime: number
  firstId: string
  lastId: string
  bidPrice: string
  bidQuantity: string
  askPrice: string
  askQuantity: string
  weightedAvgPrice: string
  volume: string
  quoteVolume: string
  count: number
}

export const execute: ExecuteWithConfig<Config> = async (request, _, config) => {
  const validator = new Validator(request, inputParameters)

  const jobRunID = validator.validated.id
  const url = `/api/v1/ticker/24hr`
  const base = (validator.overrideSymbol(ADAPTER_NAME) as string).toUpperCase()
  const quote = validator.validated.data.quote.toUpperCase()
  const symbol = `${base}_${quote}`

  const params = {
    symbol,
  }

  const options = {
    ...config.api,
    url,
    params,
  }

  const response = await Requester.request<ResponseSchema[]>(options, customError)

  const lastUpdate = response.data[0].closeTime
  const curTime = new Date()
  // If data is older than 10 minutes, discard it
  if (lastUpdate < curTime.setMinutes(curTime.getMinutes() - 10))
    throw new AdapterError({
      jobRunID,
      message: `Data is too old`,
      statusCode: 500,
    })

  const result = Requester.validateResultNumber(response.data, [0, 'lastPrice'])

  return Requester.success(jobRunID, Requester.withResult(response, result), config.verbose)
}
