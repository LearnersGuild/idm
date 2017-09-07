/* eslint-env mocha */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import nock from 'nock'

export const useFixture = {
  nockClean() {
    nock.cleanAll()
    this.apiScope = null
  }
}
