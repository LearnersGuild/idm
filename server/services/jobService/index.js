import {default as createJob} from './createJob'
import {default as processJobs} from './processJobs'

/**
 * NOTE: this service's functions are exported the way they are to enable
 * certain stubbing functionality functionality for testing that relies on the
 * way the module is cached and later required by dependent modules.
 */
export default {
  createJob,
  processJobs,
}
