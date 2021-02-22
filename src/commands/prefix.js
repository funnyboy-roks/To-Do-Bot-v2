const Discord = require('discord.js');
const chalk = require('chalk');
const DataHandler = require('../utils/DataHandler');

/**
 * @param {Discord.Message} msg
 * @param {String[]} args
 * @returns {Boolean} The command was run successfully
 */
const execute = async (msg, args) => {
	const botData = DataHandler.getData().guilds[msg.guild.id];
	switch (args.length) {
		case 0:
			await msg.channel.send(
				`Prefix: \`${botData.prefix || process.env.DEFAULT_PREFIX}\``
			);
			return true;
		case 1:
			botData.prefix = args[0];
			DataHandler.saveData();
			console.log(
				`Updated prefix for guild "${chalk.red(
					msg.guild.name
				)}" to ${chalk.yellow(args[0])}`
			);
			await msg.channel.send(`Prefix set to \`${args[0]}\`!`);
			return true;
		default:
			await msg.channel.send(
				`Command Usage: \`${
					botData.prefix || process.env.DEFAULT_PREFIX
				}${module.exports.usage}\``
			);
			return false;
	}
};

module.exports = {
	execute,
	name: 'Prefix',
	description: 'Set the prefix of this discord bot',
	permission: 'MANAGE_SERVER',
	usage: 'prefix <prefix>',
};
