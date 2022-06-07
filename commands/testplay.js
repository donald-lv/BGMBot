const { join } = require('node:path');

const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection, PlayerSubscription, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
        .setName('testplay')
        .setDescription('DESCRIPTION'),

  execute:testplay,
};

async function testplay(interaction, client) {
  const connection = getVoiceConnection(interaction.guildId);

  const resource = createAudioResource(join(__dirname, '/data/testAudio.mp3'));
  client.player.play(resource);
  connection.subscribe(client.player);

  await interaction.reply({ content: 'Finished', ephemeral: true });
}