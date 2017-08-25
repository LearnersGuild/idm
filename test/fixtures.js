/* eslint-env mocha */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import nock from 'nock'
import config from 'src/config'

export const useFixture = {
  nockClean() {
    nock.cleanAll()
    this.apiScope = null
  },
  nockEchoCreateMember(id, chapterId) {
    this.apiScope = nock(config.server.echo.baseURL)
      .post('/graphql')
      .reply(200, {
        data: {
          createMember: {id, chapterId},
        }
      })
  }
}
