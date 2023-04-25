const { SlashCommandBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("중지")
    .setDescription("노래를 중지하고 음성채널을 나갑니다."),
  async execute(interaction) {
    try {
      const queue = interaction.client.player.nodes.get(interaction.guild);
      const embed = new EmbedBuilder();

      if (!queue) {
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

      interaction.client.player.nodes.delete(interaction.guild?.id);
      await interaction.reply({
        embeds: [
          embed
            .setDescription(`대기열이 중지됬습니다.`)
            .setColor(`#F4A1BD`)
            .setTimestamp(),
        ],
      });
    } catch (error) {
      console.log(error);
    }
  },
};
