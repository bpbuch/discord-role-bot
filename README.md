# Discord Role Bot

A bot that assigns roles based on reactions using the discord.js module.

## Demo

![role bot demo](https://media.giphy.com/media/hu0TaQU0XzbGM0ZuiT/source.gif)

## Prerequisite

### Install Node.js

[Node.js](https://nodejs.org) 10+ is required to run the bot

### Create Discord Bot

1. Create an application using the [discord developer portal](https://discordapp.com/developers)
2. Create a bot for the application
3. Save the bot token for later
4. Add the bot to a server.

#### Recommended Permissions

* View Channels
* Read Message History
* Manage Roles

## Installation

1. clone this repository
2. install dependencies with: `npm install`

## Configure

The repository contains a file named `config.json` that contains configurable details for the role bot.

The file consists of two fields:

* channel - the channel that contains the role message
* roles - the mapping between reaction emoji and roles.

The bot will watch the first message in the specified channel.  If a reaction is added or removed from this message, the bot will add or remove the corresponding role.

## Run Locally

```
BOT_TOKEN=<insert-bot-token-here> npm start
```

## Deploy to Heroku

1. Create a heroku app: `heroku create`
2. Push code to heroku app: `git push heroku master`
3. Set token environment variable: `heroku config:set BOT_TOKEN=<insert-bot-token-here>`
4. Run as a worker: `heroku ps:scale web=0 worker=1`