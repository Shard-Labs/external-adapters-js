import { makeExecute } from './adapter'
import { expose } from '@chainlink/ea-bootstrap'
import { NAME, makeConfig } from './config'

const adapterContext = { name: NAME }

const { server } = expose(adapterContext, makeExecute())
export { NAME, makeConfig, makeExecute, server }
