module.exports = {
    name: `interactionCreate`,
    async execute(button) {
        if (!button.isButton()) return
        if (isMaintenance(button.user.id)) return

        button.deferUpdate().catch(() => { })

        if (!button.customId.startsWith("codeCompleto")) return

        if (button.customId.split(",")[1] != button.user.id) return

        var version = button.customId.split(",")[3];

        var codice = client.codes.find(cmd => cmd.id == button.customId.split(",")[2]);

        var attachment = new Discord.MessageAttachment(Buffer.from(codice["v" + version].trim(), 'utf-8'), `${codice.name} v${version} - GiulioAndCode.txt`)

        var embed = new Discord.MessageEmbed()
            .setTitle(`${codice.category == "commands" ? "🎡" : codice.category == "utility" ? "🧰" : codice.category == "moderation" ? "🔨" : codice.category == "fun" ? "🤣" : codice.category == "manage" ? "📁" : codice.category == "errors" ? "🚫" : ""} ${codice.name.toUpperCase()} ${codice.category == "commands" ? "🎡" : codice.category == "utility" ? "🧰" : codice.category == "moderation" ? "🔨" : codice.category == "fun" ? "🤣" : codice.category == "manage" ? "📁" : codice.category == "errors" ? "🚫" : ""}`)
            .setDescription(codice.description + "\r_Version: `Discord.js v13`_")
            .setDescription(`${codice.description}
_Version: \`Discord.js v${version}\`_`)

        button.user.send({ embeds: [embed], files: [attachment] })
            .catch(() => { })
    },
};
