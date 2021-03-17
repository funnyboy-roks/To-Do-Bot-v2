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

	if (index === NaN) {
		msg.channel.send('Invalid ID, must me a number.');
		return false;
	}
	index--;
    
	if (index < 0 || index >= todoList.length) {
		msg.channel.send(
			`Invalid ID for this channel. Possible values: 1-${todoList.length}`
		);
		return false;
	}

    const item = todoList[index];
    // Category, Name, Added_By, Added_On, Importance, Completed

    const addedBy = msg.client.users.cache.get(item.added_by);

    const embed = {
        title: 'Item info',
        description: `Showing info for item #${index+1} in the \`${category}\` category`,
        colour: 1752220,
        fields: [
            {
                name: 'Name',
                value: item.name,
                inline: true,
            },
            {
                name: 'Author',
                value: addedBy.toString(),
                inline: true,
            },
            {
                name: 'Category',
                value: item.category,
                inline: true,
            },
            {
                name: 'Added On',
                value: utils.formatDate(new Date(item.added_on)),
                inline: true,
            },
            {
                name: 'Importance',
                value: item.importance,
                inline: true,
            },
            {
                name: 'Completed',
                value: item.completed,
                inline: true,
            },
        ]
    }

    msg.channel.send({embed});

	utils.updateMessages(msg.guild.id);
	saveData();

	return true;
};

module.exports = {
	execute,
	name: 'Info',
	description: 'Shows info about a certain item on the todo list',
	usage: 'info [category] <id>',
};
