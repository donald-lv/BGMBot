// Require the necessary discord.js classes
const fs = require('node:fs');	
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// Get commands from js modules
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

// EVENTS
// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

// When a 
client.on('messageCreate', async (msg) => {
	if (msg.author.id == client.user.id) return;
	await msg.channel.sendTyping();
	await resolveAfterXSeconds(3);
	await msg.channel.send();
	
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

});

// Login to Discord with your client's token
client.login(token);


function resolveAfterXSeconds(x) {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000 * x);
  });
}