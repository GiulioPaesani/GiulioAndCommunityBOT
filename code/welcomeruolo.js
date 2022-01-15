module.exports = {
    name: "Welcome ruolo",
    aliases: ["welcomeruolo", "ruoloachientra"],
    description: "Dare un **ruolo** a chi entra nel server",
    category: "utility",
    id: "1639466286",
    info: "",
    video: "",
    v12: `
client.on("guildMemberAdd", member => {
    if (member.user.bot) return

    member.roles.add("idRuolo");
});`,
    v13: `
client.on("guildMemberAdd", member => {
    if (member.user.bot) return

    member.roles.add("idRuolo");
});`
};
