const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("지우기")
    .setDescription("대기열 지우기"),
  async execute(interaction) {
    try {
      await interaction.deferReply();

      const queue = interaction.client.player.nodes.get(interaction.guild);
      const embed = new EmbedBuilder();

      if (!queue) {
        return interaction.reply({
          embeds: [
            embed
              .setDescription(`대기열이 없습니다.`)
              .setColor(`#F4A1BD`)
              .setTimestamp(),
          ],
          ephemeral: true,
        });
      }

      await queue.tracks.clear();

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(`대기열이 성공적으로 삭제되었습니다!`)
            .setColor(`#F4A1BD`)
            .setTimestamp(),
        ],
      });
    } catch (error) {
      console.log(error);
    }
  },
};
