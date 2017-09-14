import bluebird from 'bluebird'
import factoryGirl from 'factory-girl'

import RethinkDBAdapter from './adapters/RethinkDBAdapter'

import userFactoryDefine from './user'
import inviteCodeFactoryDefine from './inviteCode'
import userAvatarFactoryDefine from './userAvatar'

const factory = factoryGirl.promisify(bluebird)
factory.setAdapter(new RethinkDBAdapter())

userFactoryDefine(factory)
inviteCodeFactoryDefine(factory)
userAvatarFactoryDefine(factory)

export default factory
