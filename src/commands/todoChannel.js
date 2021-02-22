const discord = require('discord.js');
const DataHandler = require('../utils/DataHandler');
const ArgsProcessor = require('../utils/ArgsProcessor');
const HelpCmd = require('./help');

/**
 * @param {discord.TextChannel} channel
 */
const setupChannel = async (channel, botData, deleteOld) => {

	if(deleteOld){
		const oldChannel = await channel.client.channels.fetch(botData.todo_channel);
		await oldChannel.messages.fetch(botData.todo_message).delete();
		await oldChannel.messages.fetch(botData.help_message).delete();
	}

	const todoEmbed = {
		title: 'ToDo List',
		description: 'No items on your ToDo list at the moment!',
	};

	const todoMessage = await channel.send({ embed: todoEmbed });
	const helpMessage = await channel.send({
		embed: HelpCmd.extras.helpEmbed(channel.guild),
	});

	await todoMessage.pin();
	await helpMessage.pin();

	botData.todo_message = todoMessage.id;
	botData.help_message = helpMessage.id;

	DataHandler.saveData();
};

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
		case 2:
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

			if (
				botData.todo_channel &&
				(args.length === 1 || args[1].toLowerCase() !== 'confirm')
			) {
				await msg.channel.send(
					`You have already set your todo channel! If you want to change it, type \`${
						botData.prefix || process.env.DEFAULT_PREFIX
					}${module.exports.usage} confirm\``
				);
				return false;
			}

			await setupChannel(
				channel,
				botData,
				botData.total_channel ||
					(args.length === 3 && args[1].toLowerCase() !== 'confirm')
			);

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
