const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("넘기기")
    .setDescription("다음 재생목록을 재생합니다."),
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

      queue.node.skip();

      await interaction.reply({
        embeds: [
          embed
            .setTitle(`노래 넘김`)
            .setDescription(
              `
          ${`**[${queue.currentTrack.title}](${
            queue.currentTrack.url
          }) • ${`${queue.currentTrack.duration}`}** - ${interaction.user}`}`
            )
            .setThumbnail(`${`${queue.currentTrack.thumbnail}`}`)
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
