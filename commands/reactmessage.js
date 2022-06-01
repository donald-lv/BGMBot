const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice');
const fs = require("fs");

const charEmojis = JSON.parse(fs.readFileSync('charEmojis.json'));

module.exports = {
  data: new SlashCommandBuilder()
        .setName('reactmessage')
        .setDescription('responds to a message by reacting in letter emotes, given the message id')
        
        .addStringOption(option =>
          option.setName('messageid')
            .setDescription('id of the message')
            .setRequired(true))

        .addStringOption(option =>
          option.setName('message')
            .setDescription('message to react in emoji')
            .setRequired(true)),
  async execute(interaction) {echo(interaction)},
};

async function echo(interaction) {
  const messageId = interaction.options.getString('messageid');
  const reactMessage = interaction.options.getString('message').toLowerCase();

  console.log("reactMessage: finding messageid " + messageId);
  
  var success = false;

  msg = await interaction.channel.messages.fetch(messageId)
  .then(
    (v) => {
      success = true;
      return v;
    },
    (error) => {
      success = false;
      console.error("reactMessage: failed to find message from id");
    }
  );

  if (!success) {
    await interaction.reply({ content: "i couldn't find that message...", ephemeral: true });
    return;
  }

  for (i of reactMessage) {
    if ((/[a-z ]/).test(i)) {
      console.log("reacting: " + i + " as " + charEmojis[i]);
      
      msg.react(charEmojis[i])
      .then(
        (v) => {
          success = true;
          return v;
        },
        (error) =>
        {
          success = false;
          console.error("echo message react failed");
        }
      );
      
      if (!success) {
        await interaction.reply({ content: "i couldn't react to that message...", ephemeral: true });
        return;
      }
    }
  }


  await interaction.reply({ content: 'completed: removing in 20 seconds', ephemeral: true });


  
}