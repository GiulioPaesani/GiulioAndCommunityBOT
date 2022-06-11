module.exports = {
    name: "Welcome ruolo",
    aliases: ["welcomeruolo", "ruoloachientra"],
    description: "Dare un **ruolo** a chi entra nel server",
    category: "utility",
    id: "1639466286",
    link: "https://www.toptal.com/developers/hastebin/aqamoqonec.csharp",
    info: "",
    video: "",
    code: `
client.on("guildMemberAdd", member => {
    if (member.user.bot) return

    member.roles.add("idRuolo");
});`
};
