module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (!button.id.startsWith("annullaCompleanno")) return
        
        if (isMaintenance(button.clicker.user.id)) return
        
        button.reply.defer()

        if (button.id.split(",")[1] != button.clicker.user.id) return

        var userstats = userstatsList.find(x => x.id == button.clicker.user.id);
        if (!userstats) return

        button.message.delete()
    },
};
