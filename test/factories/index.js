import bluebird from 'bluebird'
import factoryGirl from 'factory-girl'

import userFactoryDefine from './user'

const factory = factoryGirl.promisify(bluebird)
factory.setAdapter(new factory.ObjectAdapter())

userFactoryDefine(factory)

export default factory
