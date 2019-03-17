const data = require('./data')

const isAuthorizedUser = (user) => {

  return Object.keys(data.get().users).includes(user.id.toString())
}

const athorizeUser = (user, callback) => {

  data.get().users[user.id] = user.first_name

  data.save(callback)
}

const getUserNick = (user) => {

  return data.get().users[user.id]
}

const setUserNick = (user, nick, callback) => {

  data.get().users[user.id] = nick

  data.save(callback)
}

const getUserIdFromNick = (nick) => {

  const users = data.get().users

  const userId = Object.keys(users).find(userId => users[userId] === nick)

  if (userId) {
    return +userId
  }
}

module.exports = {
  isAuthorizedUser,
  athorizeUser,
  getUserNick,
  setUserNick,
  getUserIdFromNick
}