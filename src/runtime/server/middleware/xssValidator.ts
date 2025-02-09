import { defineEventHandler, createError, getQuery, readBody } from 'h3'
import { useRuntimeConfig } from '#imports'
import { FilterXSS } from 'xss'

const securityConfig = useRuntimeConfig().security
const xssValidator = new FilterXSS(securityConfig.xssValidator.value)

export default defineEventHandler(async (event) => {
  if (['POST', 'GET'].includes(event.node.req.method!!)) {
    const valueToFilter = event.node.req.method === 'GET' ? getQuery(event) : readBody(event)
    const stringifiedValue = JSON.stringify(valueToFilter)
    const processedValue = xssValidator.process(JSON.stringify(valueToFilter))
    if (processedValue !== stringifiedValue) {
      throw createError({ statusCode: 400, statusMessage: 'Bad Request' })
    }
  }
})
