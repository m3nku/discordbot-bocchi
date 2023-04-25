const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("재개")
    .setDescription("노래를 재개합니다."),
  async execute(interaction) {
    try {
      const queue = interaction.client.player.nodes.get(interaction.guild);
      const embed = new EmbedBuilder();

      if (!queue || !queue.isPlaying()) {
        return interaction.reply({
          embeds: [
            embed
              .setDescription(`재생중인 항목이 없습니다.`)
              .setColor(`#F4A1BD`)
              .setTimestamp(),
          ],
          ephemeral: true,
        });
      }

      const paused = queue.node.setPaused(false);
      return interaction.reply({
        embeds: [
          embed
            .setDescription("성공적으로 재개되었습니다.")
            .setColor(`#F4A1BD`)
            .setTimestamp(),
        ],
      });
    } catch (error) {
      console.log(error);
    }
  },
};
