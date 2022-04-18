const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with pong!'),
  execute: ping,
};

async function ping(interaction) {
  await interaction.reply('Pong!');
}