module.exports = {
    name: `message`,
    async execute(message) {
        if (message.type != "USER_PREMIUM_GUILD_SUBSCRIPTION" && message.type != "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1" && message.type != "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2" && message.type != "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3") return

        if (message.author.bot) return

        var numeroBoost;
        if (message.content == "")
            numeroBoost = 1;
        else
            numeroBoost = parseInt(message.content)

        var livelloVecchio;
        var testoMancano;
        var nuovoLivello;
        if (message.type == "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1") {
            nuovoLivello = `:beginner: **LIVELLO 1 sbloccato**
+50 emoji
+15 sticker
Qualità audio 128 Kpms
Icona server animata
Sfondo inviti
Streaming fino a 720p`
        }
        else if (message.type == "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2") {
            nuovoLivello = `:beginner: **LIVELLO 2 sbloccato**
+50 emoji
+15 sticker
Qualità audio 256 Kpms
Banner del server
50 MB limite di caricamenti
Streaming fino a 1080p 60fps`
        }
        else if (message.type == "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3") {
            nuovoLivello = `:beginner: **LIVELLO 3 sbloccato**
+100 emoji
+30 sticker
Qualità audio 384 Kpms
Vanity URL
100 MB limite di caricamenti`
        }

        if (message.guild.premiumSubscriptionCount - numeroBoost < 2) {
            livelloVecchio = 0
            if (2 - message.guild.premiumSubscriptionCount == 1)
                testoMancano = `_Manca solo **1 potenziamento** per il **Livello 1**_`
            else
                testoMancano = `_Mancano solo **${2 - message.guild.premiumSubscriptionCount} potenziamenti** per il **Livello 1**_`
        }
        else if (message.guild.premiumSubscriptionCount - numeroBoost < 7) {
            livelloVecchio = 1
            if (7 - message.guild.premiumSubscriptionCount == 1)
                testoMancano = `_Manca solo **1 potenziamento** per il **Livello 2**_`
            else
                testoMancano = `_Mancano solo **${7 - message.guild.premiumSubscriptionCount} potenziamenti** per il **Livello 2**_`
        }
        else {
            livelloVecchio = 3
            if (14 - message.guild.premiumSubscriptionCount == 1)
                testoMancano = `_Manca solo **1 potenziamento** per il **Livello 3**_`
            else if (14 - message.guild.premiumSubscriptionCount > 0)
                testoMancano = `_Mancano solo **${14 - message.guild.premiumSubscriptionCount} potenziamenti** per il **Livello 3**_`
            else
                testoMancano = ""
        }


        var embed = new Discord.MessageEmbed()
            .setTitle(":tada: Server boost :tada:")
            .setColor("#FF73FA")
            .setDescription(`Grazie tantissime a <@${message.author.id}> per aver boostato il server!`)
            .addField(`Ha potenziato il server con ${numeroBoost} boost`, `\`Lvl. ${livelloVecchio} Boost ${message.guild.premiumSubscriptionCount - numeroBoost}\` > \`Lvl. ${message.guild.premiumTier} Boost ${message.guild.premiumSubscriptionCount}\`

${nuovoLivello ? nuovoLivello : testoMancano}
`)

        var canale = client.channels.cache.get(config.idCanaliServer.announcements);
        canale.send(embed);
    },
};
