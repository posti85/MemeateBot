const data = require('./data')

const createNewMeme = (userId, date) => {

  const memes = data.get().memes

  return {
    id: memes.length ? memes[memes.length - 1].id + 1 : 1,
    userId,
    date,
    messages: [],
    votes: []
  }
}

const saveNewMeme = (meme, callback) => {

  data.get().memes.push(meme)

  data.save(callback)
}

const getMemeById = (memeId) => {

  return data.get().memes.find(m => m.id === memeId)
}

const processUserVote = (meme, user, callback) => {

  const iUser = meme.votes.indexOf(user.id)

  if (iUser < 0) {
    meme.votes.push(user.id)
  } else {
    meme.votes.splice(iUser, 1);
  }

  data.save(callback)

  return meme.votes.length
}

module.exports = {
  createNewMeme,
  saveNewMeme,
  getMemeById,
  processUserVote
}