const chalk = require('chalk');
const discord = require('discord.js');
const { getData: botData } = require('../data/DataHandler');

const commands = {
	// ping: require('./ping'), // !ping
	help: require('./help'), // !help
	prefix: require('./prefix'), // !prefix [prefix]
	todochannel: require('./todoChannel'), // !todoChannel [channel]
	add: require('./add'), // !add [[category]] <itemName>
	complete: require('./complete'), // !complete [category] <item>
	info: require('./info'), // !info [category] <item>
};

/**
 *
 * Handles the commands and running the correct functions when called
 *
 * @param {discord.Message} msg The message that may be calling the command
 * @returns {Boolean} Whether the message was a command in that server
 */
const handle = async (msg) => {
	if (msg.author.bot) return;
	const prefix =
		botData().guilds[msg.guild.id].prefix || process.env.DEFAULT_PREFIX;

	if (msg.content.startsWith(prefix)) {
		const tokens = msg.content.split(' ');

		const commandStr = tokens
			.shift()
			.substring(prefix.length)
			.toLowerCase();

		if (Object.keys(commands).includes(commandStr)) {
			const command = commands[commandStr];

			if (
				!command.permission ||
				msg.guild.member(msg.author).hasPermission(command.permission)
			) {
				const commandResult = await command.execute(msg, tokens, {
					command,
				});
				console.log( // Logging
					(commandResult ? chalk.green : chalk.red)(
						`[${msg.guild.name}#${msg.channel.name}(${msg.author.tag})] ${msg.content}`
					)
				);
			}
			return true;
		}
	}
	// console.log(
	// 	chalk.yellow`[${msg.guild.name}#${msg.channel.name}(${msg.author.tag})] ${msg.content}`
	// );

	return false;
};

module.exports = { handle, commands };
