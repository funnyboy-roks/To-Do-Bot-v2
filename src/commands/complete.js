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

	if (args.length === 0 || args.length > 2) {
		msg.channel.send(`Usage: ${module.exports.usage}`);
		return false;
	}

	let category = 'default';

	if (args.length === 2) {
		category = args[0];
		if (!Object.keys(data.todo_items).includes(category)) {
			msg.channel.send(`Unknown category \`${category}\`.`);
			return false;
		}
	}

	if (Object.keys(data.todo_items).length < 1) {
		msg.channel.send("You don't have any todo items!");
		return false;
	}

	const todoList = data.todo_items[category];

	if (todoList.length === 0) {
		msg.channel.send('This category has no items!');
		return false;
	}

	let index = args.length === 1 ? +args[0] : +args[1];

	if (index !== 0 && !index) {
		msg.channel.send('Invalid ID, must be a number.');
		return false;
	}
	index--;
    
	if (index < 0 || index >= todoList.length) {
		msg.channel.send(
			`Invalid ID for this channel. Possible values: 1-${todoList.length}`
		);
		return false;
	}

    todoList[index].completed = true;

	utils.updateMessages(msg.guild.id);
	saveData();

	return true;
};

module.exports = {
	execute,
	name: 'Complete',
	description: 'Completes an item off of the ToDo list.',
	usage: 'complete [category] <id>',
};
