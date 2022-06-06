// Require the necessary discord.js classes
const fs = require('node:fs');	
const wait = require('node:timers/promises').setTimeout;

const { Client, Collection, Intents } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

const { token } = require('./config.json');
connection = getVoiceConnection();

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, 
																			Intents.FLAGS.GUILD_MESSAGES,
																			Intents.FLAGS.GUILD_VOICE_STATES,
																		 ] });

// Get commands from js modules
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

// create voice player
client.voice;

// EVENTS
// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

// When an interaction occurs
client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	try {
		console.log(client);
		await command.execute(interaction, client);
	} catch (err) {
		console.error(err);
	}

});

// When a message is sent
client.on('messageCreate', async (msg) => {
	if (msg.author.id == client.user.id) return;
});

// Login to Discord with your client's token
client.login(token);