const Discord = require('discord.js');
const { getData, saveData } = require('../data/DataHandler');
const utils = require('../utils');

/**
 * @param {Discord.Message} msg
 * @param {String[]} args
 * @returns {Boolean} The command was run successfully
 */
const execute = async (msg, args) => {
	const data = getData().guilds[msg.guild.id];

	if (args.length === 0) {
		msg.channel.send(`Usage: ${module.exports.usage}`);
		return false;
	}

	let category = 'default';
	const matches = args[0].match(/^\[([^\s]{3,})\]$/i);
	if (matches) {
		category = matches[1].toLowerCase();
		args.shift();
	}

	if(!data.todo_items[category]){
		data.todo_items[category] = [];
	}

	data.todo_items[category].push(
		{
			category,
			name: args.join(' '),
			added_by: msg.author.id,
			added_on: (new Date()).toISOString(),
			importance: 0,
			completed: false,
		}
	);

	utils.updateMessages(msg.guild.id);
	saveData();

	return true;
};

module.exports = {
	execute,
	name: 'Add',
	description: 'Adds an item to the todo list of a certain category',
	usage: 'add [[category]] <name>',
	example: 'add [test] ToDo Item',
	exampleDescription: 'Adds an item called "ToDo Item" to the "test" category.'
};
