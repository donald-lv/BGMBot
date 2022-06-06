const fs = require("fs");
const wait = require('node:timers/promises').setTimeout;

const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice');
const { PermissionFlagsBits } = require('discord-api-types/v10');


const contents = fs.readFileSync('charEmojis.json');
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
  interaction.deferReply();

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

  let tempCharEmojis = charEmojis;
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
          reactEmoji = tempCharEmojis[checkKey][0];

          let doReact = false;

          // since key matches, reroll until a matching emoji that hasnt been reacted yet appears or no more emojis
          while (reactEmoji && !doReact) {
            // remove the emoji from the pools of available characters
            for (removeKey in tempCharEmojis) {
              tempCharEmojis[removeKey] = tempCharEmojis[removeKey].filter((elem) => (elem != reactEmoji));
            }

            // check if react doesnt exist among existing reactables
            doReact = true;
            for ([emoji, reaction] of msg.reactions.cache) {
              if (emoji == reactEmoji) {
                console.log(reactEmoji + " reaction already reacted");
                doReact = false;
                break;
              }
            }

            if (!doReact) reactEmoji = tempCharEmojis[checkKey][0];
          }

          // if react was found that works, react
          if (doReact) {
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

  let outMsg = "Completed reacting " + reactMessage + " : removing in 20 seconds\n";

  if (unrecognizedChars > 0) outMsg += unrecognizedChars + " were unrecognized\n";
  if (failedChars > 0) outMsg += failedChars + " failed to be reacted\n";

  await interaction.editReply({ content:outMsg, ephemeral: true });
  await wait(20000);

  console.log("removing")
  for (emoji of reactedEmojis) {
    await msg.reactions.cache.get(emoji).users.remove(client.user.id);
  }

}