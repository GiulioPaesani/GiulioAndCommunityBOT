module.exports = {
    name: `interactionCreate`,
    async execute(button) {
        if (!button.isButton()) return
        if (button.customId != "candidatiHelper") return

        button.deferUpdate().catch(() => { })

        if (isMaintenance(button.user.id)) return

        var userstats = userstatsList.find(x => x.id == button.user.id);
        if (!userstats) return

        if (userstats.level < 15) {
            var embed = new Discord.MessageEmbed()
                .setTitle("Diventa AIUTANTE")
                .setColor("#f68e56")
                .setDescription(":no_entry_sign: Per candidarsi come **Aiutante** è necessario almeno il **Livello 15**")
                .setThumbnail("https://i.postimg.cc/ZKghn7NF/Copertina-triste.jpg")

            button.user.send({ embeds: [embed] })
                .catch(() => { })
            return
        }

        var embed = new Discord.MessageEmbed()
            .setTitle("Diventa AIUTANTE")
            .setColor("#f68e56")
            .setDescription("Qua potrai candidarti come **AIUTANTE** all'interno del server\rSarà un lavoro duro, quindi buona scelta")
            .addField(":page_facing_up: Come candidarsi", "Ti basta cliccare sul bottone qua sotto per aprire il **form** da compilare\rDovrai rispondere diverse domande sia **personali** che **teoriche** in modo che lo staff possa riuscire a trovare le persone giuste\rQuindi **clicca qua sotto** per iniziare subito")
            .setThumbnail("https://i.postimg.cc/SNjhyFnx/Copertina.jpg")

        var button1 = new Discord.MessageButton()
            .setLabel("Candidati")
            .setStyle("LINK")
            .setURL("https://forms.gle/J2e7UuquMr9HpKzz8")

        var row = new Discord.MessageActionRow()
            .addComponents(button1)

        button.user.send({
            components: [row],
            embeds: [embed]
        }).catch(() => { })
    },
};
