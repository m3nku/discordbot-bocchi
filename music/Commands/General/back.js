const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("이전재생")
    .setDescription("이전에 재생한 노래를 재생합니다."),
  async execute(interaction) {
    try {
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

      const lastSong = queue.history.previousTrack;
      await queue.history.previous();
      return interaction.reply({
        embeds: [
          embed
            .setTitle(`이전 노래 재생`)
            .setDescription(
              `${`**[${lastSong.title}](${
                lastSong.url
              }) • ${`${lastSong.duration}`}** - ${interaction.user}`}`
            )
            .setThumbnail(`${`${lastSong.thumbnail}`}`)
            .setColor(`#F4A1BD`)
            .setTimestamp()
            .setFooter({
              text: `이벤트 루프 지연 ${interaction.client.player.eventLoopLag.toFixed(
                0
              )}`,
            }),
        ],
      });
    } catch (error) {
      console.log(error);
    }
  },
};
