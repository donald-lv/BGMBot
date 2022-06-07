const fs = require("node:fs");
const wait = require('node:timers/promises').setTimeout;
const { join } = require("node:path");

const { SlashCommandBuilder } = require('@discordjs/builders');

const SECONDS_BEFORE_REMOVE = 10;

const contents = fs.readFileSync(join(__dirname, '/data/charEmojis.json'));
const charEmojis = JSON.parse(contents);

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
  execute: reactmessage,
};

async function reactmessage(interaction, client) {
  interaction.deferReply({ ephemeral: true });

  const messageId = await interaction.options.getString('messageid');
  const reactMessage = await interaction.options.getString('message').toUpperCase();
  
  console.log("reactMessage: finding messageid " + messageId);
  
  let success = false;

  let msg = await interaction.channel.messages.fetch(messageId)
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
    console.log("failed to find message");
    await interaction.editReply({ content: "I couldn't find that message...", ephemeral: true });
    return;
  }

  console.log("message found: " + msg.content);

  console.log(Object.keys(msg.reactions.cache));

  let unrecognizedChars = 0;
  let failedChars = 0;
  let reactedEmojis = [];
  
  // message check iterate
  for (i = 0; i < reactMessage.length;) {
    let reactEmoji = null;

    // emulation of for else loop:
    find: {
      // check keys: a search for reactEmoji's val
      for (checkKey in charEmojis) {
        // if key matches respective slice
        if (checkKey == reactMessage.slice(i, i + checkKey.length)) {
          // get an emoji that hasnt been reacted yet
          reactEmoji = charEmojis[checkKey].filter(x => 
            {
              for (reacted of msg.reactions.cache.keys()) {
                if (reacted == x) return false;
              }
              return true;
            })[0];
          
          // if proper react was found, react
          if (reactEmoji) {
            await msg.react(reactEmoji)
            .then(
              (v) => {
                success = true;
                return v;
              },
              (error) =>
              {
                success = false;
                console.error(error);
              }
            );

            if (!success) {
              await interaction.editReply({ content: "I failed a react to that message...", ephemeral: true });
              return;
            }

            reactedEmojis.push(reactEmoji);

            console.log(checkKey + " reacted as " + reactEmoji);
            i += checkKey.length;
            break find;
          } else {
            console.log(checkKey + " failed");
            ++i;
            ++failedChars;
            break find;
          }
        }
      }
      // emulation of for else loop: else block
      console.log(reactMessage[i] + " unrecognized");
      ++i;
      ++unrecognizedChars;
    }
  }

  let outMsg = "Completed reacting " + reactMessage + " : removing in " + SECONDS_BEFORE_REMOVE +" seconds\n";

  if (unrecognizedChars > 0) outMsg += unrecognizedChars + " were unrecognized\n";
  if (failedChars > 0) outMsg += failedChars + " failed to be reacted\n";
  
  await interaction.editReply(outMsg);

  console.log("watiting...");
  await wait(SECONDS_BEFORE_REMOVE * 1000);

  console.log("removing")
  for (emoji of reactedEmojis) {
    await msg.reactions.cache.get(emoji).users.remove(client.user.id);
  }

  console.log("completed");
}