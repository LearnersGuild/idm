export default class RethinkDBAdapter {
  build(Model, values) {
    return _isThinkyModel(Model) ? new Model(values) : values
  }

  save(doc, Model, cb) {
    return _isThinkyModel(Model) ?
      Model
        .save(doc)
        .then(savedDoc => cb(null, savedDoc))
        .catch(cb) :
      Model
        .insert(doc, {returnChanges: 'always'})
        .run(cb)
  }

  destroy(doc, Model, cb) {
    return _isThinkyModel(Model) ?
      Model
        .get(doc.id)
        .delete()
        .execute()
        .then(() => cb())
        .catch(cb) :
      Model
        .get(doc.id)
        .delete()
        .run(cb)
  }
}

function _isThinkyModel(Model) {
  return Model && typeof Model.define === 'function'
}
