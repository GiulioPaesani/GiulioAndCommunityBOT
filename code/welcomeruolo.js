module.exports = {
    name: "welcomeruolo",
    aliases: ["ruoloachientra"],
    description: "Dare un **ruolo** a chi entra nel server",
    info: "Prima di usare il comando, è necessario andare nelle impostazioni del bot sul [sito developer](https://discord.com/developers/applications) e andare nella sezione \"Bot\". Attivare le due opzioni in \"Privileged Gateway Intents\" (sia PRESENCE INTENT che SERVER MEMBERS INTENT)",
    video: "",
    code: `
client.on("guildMemberAdd", member => {
    if (member.user.bot) return
    member.roles.add("idRuolo");
});`
};
