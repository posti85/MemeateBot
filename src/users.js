const data = require('./data')

const isAuthorizedUser = (sender) => {

  return !!getUserById(sender.id)
}

const athorizeUser = (sender, callback) => {

  const storedUser = getUserById(sender.id)

  if (storedUser) {

    callback()

  } else {

    data.get().users.push({
      id: sender.id,
      nickname: sender.first_name
    })

    data.save(callback)
  }
}

const getUserNickname = (sender) => {

  const storedUser = getUserById(sender.id)

  if (storedUser) {
    return storedUser.nickname
  }
}

const setUserNickname = (sender, nickname, callback) => {

  const storedUser = getUserById(sender.id)

  if (storedUser) {

    storedUser.nickname = nickname;
    data.save(callback)

  } else {

    callback(true) // error
  }
}

const getUserById = (userId) => {

  return data.get().users.find(user => user.id === userId)
}

const getUserFromNickname = (nickname) => {

  return data.get().users.find(user => user.nickname === nickname)
}

module.exports = {
  isAuthorizedUser,
  athorizeUser,
  getUserNickname,
  setUserNickname,
  getUserFromNickname
}