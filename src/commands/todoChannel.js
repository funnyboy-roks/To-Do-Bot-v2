const discord = require('discord.js');
const DataHandler = require('../utils/DataHandler');
const ArgsProcessor = require('../utils/ArgsProcessor');

/**
 * @param {discord.Message} msg
 * @param {String[]} args
 * @returns {Boolean} The command was run successfully
 */
const execute = async (msg, args) => {
	const botData = DataHandler.getData().guilds[msg.guild.id];
	switch (args.length) {
		case 0:
			await msg.channel.send(
				botData.todo_channel
					? `ToDo Channel currently set to <#${botData.todo_channel}>.`
					: `ToDo channel unset! Set it with \`${
							botData.prefix || process.env.DEFAULT_PREFIX
					  }${module.exports.usage}\``
			);
			return true;
		case 1:
			const channelId =
				args[0] === 'this'
					? msg.channel.id
					: ArgsProcessor.channelMention(args[0]);
			if (!channelId) break;
			const channel =
				args[0] === 'this'
					? msg.channel
					: msg.guild.channels.cache.find(
							(channel) => '' + channel.id === channelId
					  );
			if (!channel) break;

			botData.todo_channel = channelId;
			DataHandler.saveData();

			await msg.channel.send(`ToDo channel updated to: <#${channelId}>`);

			return true;
	}
	await msg.channel.send(
		`Command Usage: \`${botData.prefix || process.env.DEFAULT_PREFIX}${
			module.exports.usage
		}\``
	);
	return false;
};

module.exports = {
	execute,
	name: 'Todo Channel',
	description: 'Sets the channel for the bot to send the todo messages.',
	permission: 'MANAGE_SERVER',
	usage: 'todoChannel [channelMention|this]',
};
