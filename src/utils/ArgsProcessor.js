const { MessageMentions } = require('discord.js');

/**
 * Gets a User ID from a mention string
 *
 * @param {String} text The mention text to parse
 * @returns {Boolean|String} The ID of the user or `false` if it's not a valid mention
 */
const userMention = (text) => {
	const matches = text.match(/^<@!?(\d+)>$/);
	if (!matches) return false;
	return matches[1];
};

/**
 * Gets a Role ID from a mention string
 *
 * @param {String} text The mention text to parse
 * @returns {Boolean|String} The ID of the role or `false` if it's not a valid mention
 */
const roleMention = (text) => {
	const matches = text.match(/^<@&(\d+)>$/);
	if (!matches) return false;
	return matches[1];
};

/**
 * Gets a Channel ID from a mention string
 *
 * @param {String} text The mention text to parse
 * @returns {Boolean|String} The ID of the channel or `false` if it's not a valid mention
 */
const channelMention = (text) => {
	const matches = text.match(/^<#?(\d+)>$/);
	if (!matches) return false;
	return matches[1];
};

/**
 * Whether the text has `@everyone` or `@here`
 *
 * @param {String} text The text to check
 * @returns {Boolean} If mentions everyone
 */
const mentionsEveryone = (text) => {
	return MessageMentions.EVERYONE_PATTERN.test(text);
};

module.exports = { userMention, roleMention, channelMention };
