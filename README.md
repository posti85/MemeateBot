# MemeateBot

Send to `@MemeateBot` your meme and it will be forwarded to all target chats configured in `config.targetChats`
including in the message a button to vote it. `config.privateChatSecret` must be typed in order to use the bot.

## Setup

```
npm i
```

## Config

The `config.json` file must be created in the project root with the following content:

```
{
  "botToken": "string",
  "privateChatSecret": "string",
  "mainChannelInfo": {
    "name": "string",
    "link": "string"
  },
  "targetChats": [
    {
      "id": "number"
    },
    {
      "id": "number",
      "expirationDays": "number",
      "inviteToMainChannel": "boolean"
    },
    ...
  ]
}
```

Being:

- `botToken`: The Telegram bot token.
- `privateChatSecret`: The secret use to auth bot users.
- `mainChannelInfo`: `name` and `link` for the main channel, new chat members will be invited to it.
- `targetChats`: The target chat ids where the memes will be forwarded.
Votes in a meme will be updated if no more than `expirationDays` has passed since the meme has been published.
If `inviteToMainChannel` is set to true, new chat members will be invited to the main channel.

## Run

```
npm start
```

## To do

- `/memesOverallStats` command to get memes stats
- `/memesMonthStats` command to get memes current month stats
- `/authorsOverallStats` command to get meme authors stats
- `/authorsMonthStats` command to get meme authors current month stats
- `/removeMyLastMeme` command to remove the last submitted meme from everywhere (in case of error)
- Better log management (should we use winston?)
- Cron for forwarding the best meme and best author of the month in the last day of the month
- Improve storage management (with a DB engine)
- ...
