const fs = require('fs');
const { Client } = require('discord.js');

// the config file contains two fields:
//   channel - name of the roles channel
//   roles   - mapping between reaction and role
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// the client is created with the partial message option to capture events for uncached messages
// if this options is not set, the bot may not be aware of the message that it should be watching
const client = new Client({ partials: ['MESSAGE'] });

client.on('ready', onReady);
client.on('messageReactionAdd', addRole);
client.on('messageReactionRemove', removeRole);

client.login(process.env.BOT_TOKEN);

/**
 * 'ready' event handler for discord.js client
 * find the first message in the specified channel and save it for later
 */
async function onReady() {
  const channel = client.channels.find((channel) => channel.name === config.channel);

  // channel will not contain messages after it is found
  try {
    await channel.messages.fetch();
  } catch (err) {
    console.error('Error fetching channel messages', err);
    return;
  }

  config.message_id = channel.messages.first().id;

  console.log(`Watching message '${config.message_id}' for reactions...`)
}

/**
 * add a role to a user when they add reactions to the configured message
 * @param {Object} reaction - the reaction that the user added
 * @param {Objext} user - the user that added a role to a message
 */
async function addRole({message, _emoji}, user) {
  if (user.bot || message.id !== config.message_id) {
    return;
  }

  // partials do not guarantee all data is available, but it can be fetched
  // fetch the information to ensure everything is available
  // https://github.com/discordjs/discord.js/blob/master/docs/topics/partials.md
  if (message.partial) {
    try {
      await message.fetch();
    } catch (err) {
      console.error('Error fetching message', err);
      return;
    }
  }

  const { guild } = message;

  const member = guild.members.get(user.id);
  const role = guild.roles.find((role) => role.name === config.roles[_emoji.name]);

  if (!role) {
    console.error(`Role not found for '${_emoji.name}'`);
    return;
  }
  
  try {
    member.roles.add(role.id);
  } catch (err) {
    console.error('Error adding role', err);
    return;
  }
}

/**
 * remove a role from a user when they remove reactions from the configured message
 * @param {Object} reaction - the reaction that the user added
 * @param {Objext} user - the user that added a role to a message
 */
async function removeRole({message, _emoji}, user) {
  if (user.bot || message.id !== config.message_id) {
    return;
  }

  // partials do not guarantee all data is available, but it can be fetched
  // fetch the information to ensure everything is available
  // https://github.com/discordjs/discord.js/blob/master/docs/topics/partials.md
  if (message.partial) {
    try {
      await message.fetch();
    } catch (err) {
      console.error('Error fetching message', err);
      return;
    }
  }

  const { guild } = message;

  const member = guild.members.get(user.id);
  const role = guild.roles.find((role) => role.name === config.roles[_emoji.name]);

  if (!role) {
    console.error(`Role not found for '${_emoji.name}'`);
    return;
  }

  try{
    member.roles.remove(role.id);
  } catch (err) {
    console.error('Error removing role', err);
    return;
  }
}
