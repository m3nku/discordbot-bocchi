const {
  SlashCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("대기열")
    .setDescription("노래 대기열을 확인합니다."),
  async execute(interaction, client) {
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

      const formatTracks = queue.tracks.toArray();

      if (formatTracks.length === 0) {
        return interaction.reply({
          embeds: [
            embed
              .setDescription(`표시할 대기열이 없습니다.`)
              .setColor(`#F4A1BD`)
              .setTimestamp(),
          ],
          ephemeral: true,
        });
      }

      const tracks = formatTracks.map(
        (track, id) =>
          `**${id + 1} - [${track.title}](${track.url}) • ${track.duration}**`
      );

      const chunkSize = 10;
      const pages = Math.ceil(tracks.length / chunkSize);

      const embeds = [];
      for (let i = 0; i < pages; i++) {
        const start = i * chunkSize;
        const end = start + chunkSize;

        const embed = new EmbedBuilder()
          .setColor("#F4A1BD")
          .setTitle("노래 대기열")
          .setDescription(
            `** 현재 재생중인 노래 - [${queue.currentTrack.title}](${
              queue.currentTrack.url
            }) • ${`${queue.currentTrack.duration}`}**\n\n` +
              tracks.slice(start, end).join("\n") || "**대기중인 노래 없음.**"
          )
          .setThumbnail(`${queue.currentTrack.thumbnail}`)
          .setFooter({
            text: `페이지 ${i + 1} | 총 ${queue.tracks.size} 곡`,
          });

        embeds.push(embed);
      }

      if (embeds.length === 1) {
        return interaction.reply({
          embeds: [embeds[0]],
        });
      }

      const prevButton = new ButtonBuilder()
        .setCustomId("prev")
        .setLabel("이전")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("⬅️");

      const nextButton = new ButtonBuilder()
        .setCustomId("next")
        .setLabel("다음")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("➡️");

      const row = new ActionRowBuilder().addComponents(prevButton, nextButton);

      const message = await interaction.reply({
        embeds: [embeds[0]],
        components: [row],
        fetchReply: true,
      });

      let currentIndex = 0;
      const collector = message.createMessageComponentCollector({
        idle: 60000,
      });

      collector.on("collect", (i) => {
        i.deferUpdate();

        switch (i.customId) {
          case "prev":
            currentIndex =
              currentIndex === 0 ? embeds.length - 1 : currentIndex - 1;
            break;
          case "next":
            currentIndex =
              currentIndex === embeds.length - 1 ? 0 : currentIndex + 1;
            break;
          default:
            break;
        }

        message.edit({
          embeds: [embeds[currentIndex]],
          components: [row],
        });
      });

      collector.on("end", () => {
        message.edit({
          components: [],
        });
      });
    } catch (error) {
      console.log(error);
    }
  },
};
