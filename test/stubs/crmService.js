import crmService from 'src/server/services/crmService'
import {stubServiceAPIs} from './util'

const stubbedAPIs = stubServiceAPIs(crmService, {
  getContactByEmail: () => Promise.resolve(null),
  updateContactProperties: () => Promise.resolve(null),
})

export default stubbedAPIs
