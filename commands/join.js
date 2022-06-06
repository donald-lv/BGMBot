const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Joins your voice channel'),
  execute: join,
};

async function join(interaction) {
  
  // let author = interaction.author;

  // const voiceChannels = interaction.guild.channels.cache.filter(c => c.type == 'voice');
  const channel = interaction.member.voice.channel;

  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });

  await interaction.reply('Joined your voice channel.');
  // await setTimeout(connection.destroy(), 5000);
  
  
}