process.env.NTBA_FIX_319 = true

const TelegramBot = require('node-telegram-bot-api')
const data = require('./data')
const users = require('./users')
const memes = require('./memes')

const config = require('../config.json')
const strings = require('./strings.json')

let bot

//
// Bootstrap
//

const start = () => {

  data.load((error) => {

    if (error) {
      console.error(error)
    } else {
      startBot();
    }
  })
}

//
// Telegram bot setup and bot events handling
//

const startBot = () => {

  bot = new TelegramBot(config.botToken, { polling: true })

  bot.on('polling_error', () => {}) // Silence polling errors

  bot.on('message', onPrivateMessage)

  bot.on('callback_query', onMemeVoted)
}

const onPrivateMessage = (message) => {

  if (users.isAuthorizedUser(message.from)) {

    if (message.text) {

      if (message.text.startsWith('/nick')) {

        processNickChange(message)
      }

    } else if (message.photo || message.document || message.video) {

      processMemeForwarding(message)
    }

  } else if (message.text && message.text === config.privateChatSecret) {

    processUserAuth(message)
  }
}

const onMemeVoted = (event) => {

  const meme = memes.getMemeById(event.data)

  if (meme) {

    const numVotes = memes.processUserVote(meme, event.from)

    // Prepare all promises to edit memes votes
    let promises = meme.messages.map((message) => {

      const inlineKeyboard = getMemeInlineKeyboard(meme.id, numVotes)

      return bot.editMessageReplyMarkup(inlineKeyboard, {
        chat_id: message.chatId,
        message_id: message.messageId
      })
    })

    // Force all promises to be executed
    promises = promises.map(p => p.catch(e => e))

    // Result
    Promise.all(promises).then(() => {

      bot.answerCallbackQuery(event.id)
    })

  } else {

    bot.answerCallbackQuery(event.id)
  }
}

//
// Bot's logic
//

const processUserAuth = (message) => {

  users.athorizeUser(message.from, () => {

    sendTextMessage(message, strings.welcome,
      [users.getUserNick(message.from)])
  })
}

const processNickChange = (message) => {

  const [ , nick ] = message.text.split(' ', 2)

  if (nick) {

    users.setUserNick(message.from, nick, () => {

      sendTextMessage(message, strings.nickChanged, [nick])
    })

  } else {

    sendTextMessage(message, strings.nickCommandFormat)
  }
}

const processMemeForwarding = (message) => {

  // To publish in the name of other user

  let userId = message.caption && users.getUserIdFromNick(message.caption) || message.from.id

  const newMeme = memes.createNewMeme(userId, message.date)

  // Prepare all promises the send the meme in all target chats
  let promises = config.targetChats.map((targetChat) => {

    const options = {
      caption: strings.by + users.getUserNick({id: userId}),
      reply_markup: getMemeInlineKeyboard(newMeme.id)
    }

    if (message.photo) {
      return bot.sendPhoto(targetChat, message.photo[0].file_id, options);
    } if (message.document) {
      return bot.sendDocument(targetChat, message.document.file_id, options);
    } if (message.video) {
      return bot.sendVideo(targetChat, message.video.file_id, options);
    }
  })

  // Force all the promises to be executed, even if one of them is rejected
  promises = promises.map(p => p.catch(e => e))

  // Process all promises results
  Promise.all(promises).then((messages) => {

    newMeme.messages = messages.filter(m => m.chat).map(m => ({
      chatId: m.chat.id,
      messageId: m.message_id
    }))

    memes.saveNewMeme(newMeme)
  })
}

//
// Util functions
//

const sendTextMessage = (receivedMessage, messageText, params = []) => {

  params.forEach((p, i) => messageText = messageText.replace(`{${i}}`, p))

  bot.sendMessage(receivedMessage.chat.id, messageText, {
    parse_mode: 'Markdown'
  })
}

const getMemeInlineKeyboard = (memeId, numVotes = 0) => {

  return {
    inline_keyboard: [[ {
      text: `\u{1F923} ${numVotes}`,
      callback_data: memeId
    }]],
  }
}

module.exports = {
  start
}
