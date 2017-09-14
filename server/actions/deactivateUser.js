import {User} from 'src/server/services/dataService'

export default function deactivateUser(id) {
  return User.get(id).updateWithTimestamp({active: false})
}
