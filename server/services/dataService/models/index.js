import thinky from 'thinky'

import {autoloadFunctions} from 'src/server/util'
import {connect} from 'src/db'

const r = connect()

const t = thinky({r, createDatabase: false})
const errors = t.Errors

const modelDefinitions = autoloadFunctions(__dirname)

const models = {r, errors}
const modelDefs = {}
Object.keys(modelDefinitions).forEach(keyOfGetModel => {
  const modelDefinition = modelDefinitions[keyOfGetModel](t) || {}
  const {name, table, schema, pk} = modelDefinition

  modelDefs[name] = modelDefinition

  const model = t.createModel(table, schema, {
    pk: pk || 'id',
    table: {replicas: 1},
    enforce_extra: 'remove', // eslint-disable-line camelcase
    init: false,
  })

  model.docOn('saving', doc => {
    _updateTimestamps(doc)
  })

  model.defineStatic('updateWithTimestamp', function (values = {}) {
    return this.update(_updateTimestamps(values))
  })

  model.defineStatic('upsert', function (values = {}) {
    const {id} = values || {}
    if (!id) {
      return this.save(values)
    }

    return this
      .get(id)
      .updateWithTimestamp(values)
      .catch(errors.DocumentNotFound, () => this.save(values))
  })

  if (modelDefinition.static) {
    Object.keys(modelDefinition.static).forEach(staticFnName => {
      model.defineStatic(staticFnName, modelDefinition.static[staticFnName])
    })
  }

  models[name] = model
})

function _updateTimestamps(values = {}) {
  if (!values.updatedAt && typeof values !== 'function') {
    values.updatedAt = new Date()
  }
  return values
}

export default models
