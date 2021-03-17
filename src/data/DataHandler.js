// const MongoClient = require('mongodb').MongoClient;
// const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@to-do-bot.dmgy2.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect((err) => {
// 	const collection = client.db().collection('devices');
// 	// perform actions on the collection object
// 	console.log(err);

// 	client.close();
// });
const fs = require('fs');
const Discord = require('discord.js');

let botData = {};

const loadData = () => {
	let data = '';
	if (!fs.existsSync(process.env.DATA_FILE)) {
		data = JSON.stringify(
			{
				guilds: {},
			},
			null,
			4
		);
		fs.writeFileSync(process.env.DATA_FILE, data);
	} else {
		data = fs.readFileSync(process.env.DATA_FILE, 'utf-8');
	}
	return (botData = JSON.parse(data));
};

const saveData = () => {
	const data = JSON.stringify(botData, null, 4);
	fs.writeFileSync(process.env.DATA_FILE, data, 'utf-8');
};

/**
 * @param {Discord.Guild[]} guilds
 */
const setGuilds = (guilds) => {
	loadData();
	guilds.forEach((guild) => {
		if (!Object.keys(botData.guilds).includes('' + guild.id)) {
			botData.guilds['' + guild.id] = {
				todo_items: [],
			};
		}
	});
};

const getData = () => botData;

module.exports = {
	loadData,
	saveData,
	setGuilds,
	getData,
};
