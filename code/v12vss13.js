module.exports = {
    name: "v12 vs v13",
    aliases: ["v13", "discordjsv13"],
    description: "**Modificare** il nome di un canale",
    category: "utility",
    id: "1641213666",
    info: "Tutte le cose principali cambiate nella nuova versione di Discord.js, scorri con i bottoni sotto per vedere le differenze",
    video: "https://www.youtube.com/watch?v=BYJ5evhU-a0",
    v12: `
channel.send(embed)

var count = 5
message.channel.send(user)
embed.addField('Count', count)

const client = new Discord.Client()

const collector = message.createReactionCollector(filter, { time: 15000 })

client.on("message", message => { ... })

if(channel.type == 'text') channel.send('Content')

channel.overwritePermissions([{ id: user.id, deny: ['VIEW_CHANNEL'] }])
channel.updateOverwrite(user, { VIEW_CHANNEL: false })

member.hasPermission("SEND_MESSAGES")

message.delete({ timeout: 10000 })
`,
    v13: `
channel.send({ embeds: [embed] })

var count = 5
message.channel.send(user.toString())
embed.addField('Count', count.toString())

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"] })

const collector = message.createReactionCollector({ filter, time: 15000 })

client.on("messageCreate", message => { ... })

if(channel.type == 'GUILD_TEXT') channel.send('Content')

channel.permissionOverwrites.set([{ id: user.id, deny: ['VIEW_CHANNEL'] }])
channel.permissionOverwrites.edit(user, { VIEW_CHANNEL: false })

member.permissions.has("SEND_MESSAGES")

setTimeout(() => message.delete(), 10000)
`
};
