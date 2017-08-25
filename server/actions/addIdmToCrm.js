import {updateContactByVID} from 'src/server/services/crmService'

export async function addIdmToCrm(idmId, crmVid) {
  const properties = [{property: 'idm_id', value: idmId}]

  try {
    await updateContactByVID(crmVid, {properties})
  } catch (error) {
    throw new Error(`Error occurred while attempting to update HubSpot contact: \n${error}`)
  }
}
