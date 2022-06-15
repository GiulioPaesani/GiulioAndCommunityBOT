const Discord = require("discord.js")
const { isMaintenance } = require("../../../functions/general/isMaintenance")

module.exports = {
    name: `interactionCreate`,
    client: "general",
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (isMaintenance(interaction.user.id)) return

        if (!interaction.customId.startsWith("codeCompleto")) return

        interaction.deferUpdate().catch(() => { })

        let codice = client.codes.find(cmd => cmd.id == interaction.customId.split(",")[1]);

        if (!codice) client.channels.cache.get("985108334606688266").send(`ID: ${interaction.customId.split(",")[1]} - ${codice.toString()}`) //? DEBUG

        let attachment = new Discord.MessageAttachment(Buffer.from(codice.code.trim(), 'utf-8'), `${codice.name}-GiulioAndCode.txt`)

        let embed = new Discord.MessageEmbed()
            .setTitle(`${codice.category == "commands" ? "🎡" : codice.category == "utility" ? "🧰" : codice.category == "moderation" ? "🔨" : codice.category == "fun" ? "🤣" : codice.category == "manage" ? "📁" : codice.category == "errors" ? "🚫" : ""} ${codice.name.toUpperCase()} ${codice.category == "commands" ? "🎡" : codice.category == "utility" ? "🧰" : codice.category == "moderation" ? "🔨" : codice.category == "fun" ? "🤣" : codice.category == "manage" ? "📁" : codice.category == "errors" ? "🚫" : ""}`)
            .setDescription(`${codice.description}
                
Se vuoi puoi copiare direttamente tutto il codice da [QUI](${codice.link})
_Version: \`Discord.js v13\`_`)

        interaction.user.send({ embeds: [embed], files: [attachment] })
    },
};
