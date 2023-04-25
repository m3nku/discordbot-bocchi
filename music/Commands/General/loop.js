const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QueueRepeatMode } = require("discord-player");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("반복")
    .setDescription("반복 대기열/노래/추천재생")
    .addNumberOption((option) =>
      option
        .setName("선택")
        .setDescription("옵션을 선택합니다.")
        .setRequired(true)
        .addChoices(
          { name: "끄기", value: QueueRepeatMode.OFF },
          { name: "노래", value: QueueRepeatMode.TRACK },
          { name: "대기열", value: QueueRepeatMode.QUEUE },
          { name: "추천재생", value: QueueRepeatMode.AUTOPLAY }
        )
    ),
  async execute(interaction) {
    try {
      const queue = interaction.client.player.nodes.get(interaction.guild);
      const embed = new EmbedBuilder();

      if (!queue || !queue.isPlaying()) {
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

      const loopMode = interaction.options.getNumber("선택");

      queue.setRepeatMode(loopMode);
      const mode =
        loopMode === QueueRepeatMode.TRACK
          ? "🔂"
          : loopMode === QueueRepeatMode.QUEUE
          ? "🔂"
          : loopMode === QueueRepeatMode.OFF
          ? "⛔"
          : "🅰";
      const modetext =
        loopMode === QueueRepeatMode.TRACK
          ? "노래 반복"
          : loopMode === QueueRepeatMode.QUEUE
          ? "대기열 반복"
          : loopMode === QueueRepeatMode.OFF
          ? "끄기"
          : "추천 재생";
      return interaction.reply({
        embeds: [
          embed
            .setDescription(
              `${mode} | 반복 모드가 "${modetext}" 모드로 업데이트 되었습니다.`
            )
            .setColor(`#F4A1BD`)
            .setTimestamp(),
        ],
      });
    } catch (error) {
      console.log(error);
    }
  },
};
