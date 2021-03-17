const Discord = require('discord.js');
const { getData } = require('../data/DataHandler');
const HelpCmd = require('../commands/help');

// TODO: For help message `HelpCmd.extras.helpEmbed(channel.guild)`
const updateMessages = async (guildID = null) => {
	const data = getData();
	if (!guildID) {
		const guilds = global.botClient.guilds.cache.array();

		guilds.forEach(async (guild) => {
			const guildInfo = data.guilds[guild.id];
			if (
				!guildInfo.todo_channel ||
				!guildInfo.todo_message ||
				!guildInfo.help_message
			) {
				return;
			}

			const channel = guild.channels.cache.get(guildInfo.todo_channel);

			const todoMessage = await channel.messages.fetch(
				guildInfo.todo_message
			);

			const helpMessage = await channel.messages.fetch(
				guildInfo.help_message
			);

			await updateTodo(todoMessage, guildInfo);
			await helpMessage.edit(
				'',
				new Discord.MessageEmbed(HelpCmd.extras.helpEmbed(guild))
			);
		});
	} else {
		const guildInfo = data.guilds[guildID];
		if (
			!guildInfo.todo_channel ||
			!guildInfo.todo_message ||
			!guildInfo.help_message
		) {
			return;
		}

		const guild = global.botClient.guilds.cache.get(guildID);

		const channel = guild.channels.cache.get(guildInfo.todo_channel);
		const todoMessage = await channel.messages.fetch(
			guildInfo.todo_message
		);
		const helpMessage = await channel.messages.fetch(
			guildInfo.help_message
		);

		await updateTodo(todoMessage, guildInfo);
		await helpMessage.edit(
			'',
			new Discord.MessageEmbed(HelpCmd.extras.helpEmbed(guild))
		);
	}
};

/**
 *
 * @param {Discord.Message} message
 * @param {Object} guildInfo
 */
const updateTodo = async (message, guildInfo) => {
	const embed = {
		title: 'ToDo List',
		fields: [],
	};

	const categories = Object.keys(guildInfo.todo_items);
	let totalItems = 0;
	categories.forEach((current) => {
		totalItems += guildInfo.todo_items[current].length;
	});

	if (totalItems <= 0) {
		embed.description = 'No items on your ToDo list at the moment!';
	} else {
		embed.description = `${totalItems} item${
			totalItems !== 1 ? 's' : ''
		} on your ToDo list!`;

		const fields = [];

		categories.forEach((category) => {
			const items = guildInfo.todo_items[category];

			fields.push({
				name: titleCase(category),
				value: items
					.map(
						(item, i) =>
							`**${i + 1}** - ${item.completed ? '✅ ' : ''}\`${
								item.name
							}\``
					)
					.join('\n'),
			});
		});

		embed.fields = fields;
	}

	await message.edit('', new Discord.MessageEmbed(embed));
};

const titleCase = (str) => {
	return str
		.split(' ')
		.map((s) => s[0].toUpperCase() + s.substr(1))
		.join(' ');
};

/**
 *
 * @param {Date} date
 */
const formatDate = (date) => {
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	return (
		date.getUTCDate() +
		'-' +
		months[date.getUTCMonth()] +
		'-' +
		date.getUTCFullYear() +
		' ' +
		(''+date.getUTCHours()).padStart(2, 0) +
		':' +
		(''+date.getUTCMinutes()).padStart(2, 0) +
		':' +
		(''+date.getUTCSeconds()).padStart(2, 0) +
		' UTC'
	);
};

// export default { updateMessages };

module.exports = { updateMessages, titleCase, formatDate };
