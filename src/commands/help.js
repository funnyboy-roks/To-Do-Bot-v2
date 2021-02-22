const discord = require('discord.js');
const { getData: botData } = require('../utils/DataHandler');

const helpEmbed = (guild, author=null) => {
	const { commands } = require('./index.js');

	const prefix =
		botData().guilds[guild.id].prefix || process.env.DEFAULT_PREFIX;

	const fields = [];

	Object.keys(commands).forEach((key) => {
		const command = commands[key];
		if (
			!command.permission ||
			(!!author && guild.member(author).hasPermission(command.permission))
		) {
			fields.push({
				name: command.name,
				value: `Usage: \`${prefix}${command.usage}\`\n${command.description}`,
			});
		}
	});

	const embed = {
		title: 'Help',
		description: 'All commands shown are accessable to you.',
		fields,
	};
	if(!!author){
		embed.author = {
			name: author.name,
			iconURL: author.avatarURL(),
		};
	}
	return embed;
};

/**
 * @param {discord.Message} msg
 * @param {String[]} args
 * @returns {Boolean} The command was run successfully
 */
const execute = async (msg, args) => {
	const embed = helpEmbed(msg.guild, msg.author);
	await msg.channel.send({ embed });
	return true;
};

module.exports = {
	execute,
	name: 'Help',
	description: 'Test Ping Command',
	usage: 'help',
	extras: {
		helpEmbed,
	},
};
