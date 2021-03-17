require('dotenv').config();
const Discord = require('discord.js');
const chalk = require('chalk');
const DataHandler = require('./data/DataHandler');
DataHandler.loadData();
const CommandHandler = require('./commands');
const utils = require('./utils/index');

const client = new Discord.Client();

global.botClient = client;

client.on('ready', () => {
	DataHandler.setGuilds(client.guilds.cache);
	DataHandler.saveData();

	console.log(`Logged in as ${chalk.blue(client.user.tag)}`);
	console.log(`With ID: ${chalk.blue(client.user.id)}`);
	console.log(
		`Guilds: ${chalk.blue(
			client.guilds.cache.map((guild) => guild.name).join(', ')
		)}`
	);
	console.log(
		`Commands: ${chalk.blue(
			Object.values(CommandHandler.commands)
				.map((c) => c.name)
				.join(', ')
		)}`
	);

	utils.updateMessages();
});

client.on('guildCreate', (guild) => {
	DataHandler.setGuilds(client.guilds.cache);
	DataHandler.saveData();

	const embed = {
		title: 'ToDo Bot Setup',
		description: `Thank you for adding the ToDo bot to your server, ${guild.name}!  You'll need to do some basic setup before you can do anything with it.`,
		fields: [
			{
				name: 'Assign a Channel',
				value:
					'You need to assign a channel to be able to do anything with the ToDo bot.  This is quite simple: you can use a pre-existing channel or create a new one, and then use the command `!TodoChannel <channelMention>`.',
			},
			{
				name: 'Setting a Prefix',
				value:
					'You can change the prefix of this bot by using the `prefix` command.  For example `!prefix ?` would change the prefix to `?`.',
			},
			{
				name: 'Help',
				value:
					'You can view all commands by using `!help` in your discord server.',
			},
			{
				name: 'Support',
				value: `If you need support for this bot, join my discord server [here](${process.env.DISCORD_INVITE})`,
			},
		],
	};

	guild.owner.send({ embed });
});

client.on('message', CommandHandler.handle);

client.login(process.env.TOKEN);
