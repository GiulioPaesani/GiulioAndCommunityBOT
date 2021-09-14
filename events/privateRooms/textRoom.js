const Discord = require("discord.js");

const { MessageButton } = require('discord-buttons');
const { MessageActionRow } = require('discord-buttons');
const ms = require("ms");
const message = require("../general/message");

module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (button.id == "textRoom") {
            var userstats = userstatsList.find(x => x.id == button.clicker.user.id);
            if (!userstats) return

            if (userstats.level < 5 && !message.member.roles.cache.has(config.idRuoloServerBooster)) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Non hai il livello")
                    .setColor(`#8F8F8F`)
                    .setDescription(`Per aprire una **stanza privata testuale** devi avere almeno il **Level 5** o **boostando** il server`)

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

            button.message.guild.channels.create(`💬│${button.clicker.user.username}-text`, {
                type: "text",
                permissionOverwrites: [
                    {
                        id: button.message.guild.id,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: button.clicker.user.id,
                        allow: ['VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS'],
                    }
                ],
                parent: button.message.channel.parentID,
                topic: `Text room by: ${button.clicker.user.username}`
            }).then(text => {
                var embed = new Discord.MessageEmbed()
                    .setTitle(":closed_lock_with_key: Private room :closed_lock_with_key:")
                    .setColor("#FFAC33")
                    .addField("Tutti i comandi", `- \`!pdelete\` - **Eliminare** la stanza
- \`!punlock\` - Rendere **pubblica** la stanza, in modo che tutti gli utenti la possano vedere
- \`!plock\` - Rendere **privata** la stanza, in modo che possano entrare e vedere solo chi inviti tu
- \`!padd [user]\` - **Aggiungere** un utente alla stanza privata
- \`!premove [user]\` - **Rimuovere** un utente dalla stanza privata
- \`!pkick [user]\` - **Kickare** un utente dalla stanza (Potrà **rientrare** quando vuole)
- \`!pban [user]\` - **Bannare** un utente dalla stanza, gli verrà **rimosso** l'accesso e non potrà piu rientrare (anche se rendi la stanza pubblica)
- \`!punban [user]\` - **Sbannare** un utente, facendolo poter rientrare nella stanza
- \`!plimit [count]\` - Impostare un **limite** di utenti che potranno entrare nella stanza **pubblica**
- \`!prename [name]\` - **Rinominare** la stanza (Se hai una stanza compresa di chat **testuale** + **vocale** dovrà invece utilizzare rispettivamente \`!ptrename\` e \`!pvrename\` in modo da **scegliere** quale canale rinominare)`)

                text.send(`<@${button.clicker.user.id}>`).then(msg => msg.delete())
                text.send(embed)

                serverstats.privateRooms.push({
                    "text": text.id,
                    "voice": null,
                    "owner": button.clicker.user.id,
                    "type": "onlyText",
                    "bans": []
                })
            })
        }
    },
};