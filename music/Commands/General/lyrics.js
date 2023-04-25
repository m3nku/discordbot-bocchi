const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { lyricsExtractor } = require("@discord-player/extractor");
const search = lyricsExtractor();
module.exports = {
  data: new SlashCommandBuilder()
    .setName("가사")
    .setDescription("노래의 가사를 찾습니다.")
    .addStringOption((option) =>
      option.setName("제목").setDescription("노래의 제목")
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply("가사 찾는중...");

      const queue = interaction.client.player.nodes.get(interaction.guild);
      const music = interaction.options.getString("제목");
      const embed = new EmbedBuilder();
      if (!queue && !music) {
        return interaction.editReply({
          embeds: [
            embed
              .setDescription("대기열이 없거나 노래제목을 언급하지 않았습니다!")
              .setColor(`#F4A1BD`)
              .setTimestamp(),
          ],
          ephemeral: true,
        });
      }

      if (queue || music) {
        const result = await search.search(music ?? queue.currentTrack.title);

        if (!result) {
          return interaction.editReply({
            embeds: [
              embed
                .setDescription(
                  `${
                    music ? music : queue.currentTrack.title
                  } 에 대한 가사를 찾을 수 없습니다.`
                )
                .setColor(`#F4A1BD`)
                .setTimestamp(),
            ],
          });
        }

        const trimmedLyrics = result.lyrics.substring(0, 1997);

        embed
          .setTitle(`${result.title}`)
          .setThumbnail(`${result.thumbnail}`)
          .setColor(`#F4A1BD`)
          .setDescription(
            trimmedLyrics.length === 1997
              ? `${trimmedLyrics}...`
              : trimmedLyrics
          );
        await interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
