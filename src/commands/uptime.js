const discord = require('discord.js');

/**
 * @param {discord.Message} msg
 * @param {String[]} args
 * @returns {Boolean} The command was run successfully
 */
const execute = async (msg, args) => {
	await msg.channel.send(msg.author.username + ' ' + args.join(' '));
	return true;
};

module.exports = {
    execute,
    name: 'Uptime',
	description: 'See Bot\'s Uptime',
	usage: 'uptime',
};
