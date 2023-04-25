const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("현재재생")
    .setDescription("현재 재생중인 노래를 확인합니다."),
  async execute(interaction) {
    try {
      const queue = interaction.client.player.nodes.get(interaction.guild);
      const embed = new EmbedBuilder();

      if (!queue) {
        return interaction.reply({
          embeds: [
            embed
              .setDescription(`아무것도 재생되고있지 않습니다.`)
              .setColor(`#F4A1BD`)
              .setTimestamp(),
          ],
          ephemeral: true,
        });
      }

      const progress = queue.node.createProgressBar();
      const ts = queue.node.getTimestamp();

      embed
        .setTitle("현재 재생중인 노래")
        .setColor(`#F4A1BD`)
        .setDescription(
          `**[${queue.currentTrack.title}](${
            queue.currentTrack.url
          }) • ${`${queue.currentTrack.duration}`}**\n\n${progress.replace(
            / 0:00/g,
            "LIVE"
          )}`
        )
        .setThumbnail(`${queue.currentTrack.thumbnail}`);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log(error);
    }
  },
};
