const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("일시정지")
    .setDescription("현재 재생중인 노래를 일시정지합니다."),
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

      const paused = queue.node.setPaused(true);
      return interaction.reply({
        embeds: [
          embed
            .setDescription(paused ? "일시정지됨." : "알 수 없는 오류")
            .setColor(`#F4A1BD`)
            .setTimestamp(),
        ],
      });
    } catch (error) {
      console.log(error);
    }
  },
};
