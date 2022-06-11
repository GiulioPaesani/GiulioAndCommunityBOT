module.exports = {
    name: "v12 vs v13",
    aliases: ["v13", "discordjsv13"],
    description: "**Modificare** il nome di un canale",
    category: "utility",
    id: "1641213666",
    link: "https://www.toptal.com/developers/hastebin/loxowesiye.js",
    info: "Tutte le cose principali cambiate nella nuova versione di Discord.js, scorri con i bottoni sotto per vedere le differenze",
    video: "https://www.youtube.com/watch?v=BYJ5evhU-a0",
    code: `
v12: channel.send(embed)
v13: channel.send({ embeds: [embed] })

v12:
let count = 5
message.channel.send(user)
embed.addField('Count', count)
v13:
let count = 5
message.channel.send(user.toString())
embed.addField('Count', count.toString())

v12: const client = new Discord.Client()
v13: const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"] })

v12: const collector = message.createReactionCollector(filter, { time: 15000 })
v13: const collector = message.createReactionCollector({ filter, time: 15000 })

v12: client.on("message", message => { ... })
v13: client.on("messageCreate", message => { ... })

v12: if(channel.type == 'text') channel.send('Content')
v13: if(channel.type == 'GUILD_TEXT') channel.send('Content')

v12:
channel.overwritePermissions([{ id: user.id, deny: ['VIEW_CHANNEL'] }])
channel.updateOverwrite(user, { VIEW_CHANNEL: false })
v13:
channel.permissionOverwrites.set([{ id: user.id, deny: ['VIEW_CHANNEL'] }])
channel.permissionOverwrites.edit(user, { VIEW_CHANNEL: false })

v12: member.hasPermission("SEND_MESSAGES")
v13: member.permissions.has("SEND_MESSAGES")

v12: message.delete({ timeout: 10000 })
v13: setTimeout(() => message.delete(), 10000)
`
};
