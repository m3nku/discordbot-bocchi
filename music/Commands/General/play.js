const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QueryType, useMasterPlayer } = require("discord-player");
const { URL } = require("url");

const isValidUrl = (str) => {
  try {
    new URL(str);
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("재생")
    .setDescription("노래를 재생합니다.")
    .addStringOption((option) =>
      option
        .setName("검색")
        .setDescription("노래를 검색합니다.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("247")
        .setDescription("24/7")
        .addChoices(
          { name: "실행", value: "false" },
          { name: "취소", value: "true" }
        )
    ),
  async execute(interaction, client) {
    try {
      const stri = interaction.options.getString("247");
      const check = interaction.options.getString("검색");

      let queryType;

      if (isValidUrl(check)) {
        queryType = QueryType.AUTO;
      } else {
        queryType = QueryType.YOUTUBE;
      }

      const result = await client.player.search(check, {
        requestedBy: interaction.user,
        searchEngine: queryType,
      });

      const results = new EmbedBuilder()
        .setTitle(`검색결과 없음`)
        .setColor(`#F4A1BD`)
        .setTimestamp();

      if (!result.hasTracks()) {
        return interaction.reply({ embeds: [results], ephemeral: true });
      }

      const embed = new EmbedBuilder();

      await interaction.deferReply();
      await interaction.editReply({
        embeds: [
          embed
            .setDescription(
              `${result.playlist ? "플레이리스트" : "노래"} 로딩중...`
            )
            .setColor(`#F4A1BD`)
            .setTimestamp(),
        ],
      });

      const yes = await client.player.play(
        interaction.member.voice.channel?.id,
        result,
        {
          nodeOptions: {
            metadata: {
              channel: interaction.channel,
              client: interaction.guild?.members.me,
              requestedBy: interaction.user.username,
            },
            volume: 20,
            bufferingTimeout: 3000,
            leaveOnEnd: stri === "false" ? false : true,
          },
        }
      );

      function yess() {
        const totalDurationMs = yes.track.playlist.tracks.reduce(
          (a, c) => c.durationMS + a,
          0
        );
        const totalDurationSec = Math.floor(totalDurationMs / 1000);
        const hours = Math.floor(totalDurationSec / 3600);
        const minutes = Math.floor((totalDurationSec % 3600) / 60);
        const seconds = totalDurationSec % 60;
        const durationStr = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        return durationStr;
      }

      embed
        .setTitle(`대기열 추가`)
        .setDescription(
          `${
            yes.track.playlist
              ? `**[${yes.track.playlist.title}](${yes.track.playlist.url}) • ${
                  yes.track.playlist ? `${yess()}` : `${yes.track.duration}`
                }**`
              : `**[${yes.track.title}](${yes.track.url}) • ${
                  yes.track.playlist ? `${yess()}` : `${yes.track.duration}`
                }**`
          }`
        )
        .setThumbnail(
          `${
            yes.track.playlist
              ? `${yes.track.playlist.thumbnail.url}`
              : `${yes.track.thumbnail}`
          }`
        )
        .setColor(`#F4A1BD`)
        .setTimestamp()
        .setFooter({
          text: `이벤트 루프 지연 ${client.player.eventLoopLag.toFixed(0)}`,
        });
      return interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(error);
    }
  },
};
