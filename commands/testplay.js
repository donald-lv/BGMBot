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

  const resource = createAudioResource();

  await interaction.reply({ content: 'Finished', ephemeral: true });
}