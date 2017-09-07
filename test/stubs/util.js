import {stub} from 'sinon'

export function stubServiceAPIs(service, methods) {
  const enableOne = methodName => stub(service, methodName).callsFake(methods[methodName])
  const enable = () => Object.keys(methods).forEach(methodName => enableOne(methodName))

  const disableOne = methodName => service[methodName].restore()
  const disable = () => Object.keys(methods).forEach(methodName => disableOne(methodName))

  const resetOne = methodName => service[methodName].reset()
  const reset = () => Object.keys(methods).forEach(methodName => resetOne(methodName))

  const withArgs = (methodName, ...args) => service[methodName].withArgs(...args)

  return {
    enableOne,
    enable,
    disableOne,
    disable,
    resetOne,
    reset,
    withArgs,
  }
}
