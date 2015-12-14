const mockUser = {
  id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  name: 'Mock User Name',
  email: 'mockuser@example.com',
}


export function findUsers(req, res) {
  res.status(200).json([mockUser])
}

export function getUserById(req, res) {
  res.status(200).json(mockUser)
}

export function getCurrentUser(req, res) {
  res.status(200).json(mockUser)
}
