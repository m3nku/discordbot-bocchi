const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "messageCreate",

    async execute(message) {
        if (!message.guild || message.author.bot) return;

    }
}