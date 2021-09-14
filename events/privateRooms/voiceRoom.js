const Discord = require("discord.js");

const { MessageButton } = require('discord-buttons');
const { MessageActionRow } = require('discord-buttons');
const ms = require("ms");

module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (button.id == "voiceRoom") {
            var userstats = userstatsList.find(x => x.id == button.clicker.user.id);
            if (!userstats) return

            if (userstats.level < 10 && !message.member.roles.cache.has(config.idRuoloServerBooster)) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Non hai il livello")
                    .setColor(`#8F8F8F`)
                    .setDescription(`Per aprire una **stanza privata vocale** devi avere almeno il **Level 10** o **boostando** il server`)

                button.clicker.user.send(embed)
                    .catch(() => { return })
                return
            }

            var privaterooms = serverstats.privateRooms

            if (privaterooms.find(x => x.owner == button.clicker.user.id)) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Hai già una stanza")
                    .setColor(`#8F8F8F`)
                    .setDescription(`Hai già una stanza privata aperta`)

                button.clicker.user.send(embed)
                    .catch(() => { })
                return
            }

            button.message.guild.channels.create(`🔊│${button.clicker.user.username}-voice`, {
                type: "voice",
                permissionOverwrites: [
                    {
                        id: button.message.guild.id,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: button.clicker.user.id,
                        allow: ['VIEW_CHANNEL'],
                    }
                ],
                parent: button.message.channel.parentID
            }).then(voice => {
                serverstats.privateRooms.push({
                    "text": null,
                    "voice": voice.id,
                    "owner": button.clicker.user.id,
                    "type": "onlyVoice",
                    "bans": []
                })
            })
        }
    },
};