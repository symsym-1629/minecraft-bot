const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const User = require("../database/models/User.js");
const Book = require("../database/models/Book.js");
// on exporte ici le data, l'autocomplete (qui permet de compléter les arguments du string book) et le execute (ce qui va etre exécuté en gros)
module.exports = {
  data: new SlashCommandBuilder()
    .setName("yourlist") // le nom de la commande
    .setDescription("La liste de tes livres réservés") // la description
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("Your MC username")
        .setRequired(true)
        .setAutocomplete(false)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const username = interaction.options.getString("username");
    const user = await User.findOne({ where: { username: username } });
    if (!user) {
        return await interaction.editReply({
          content: `Il n'y a pas de livre réservés`,
          ephemeral: true,
        });
      }
    const reserved = user.reserved
    let books = reserved.split(",");
    
    let embeds = [];
    for (const bookId of books) {
      let book = await Book.findOne({ where: { id: bookId } });
      let embed = new Discord.EmbedBuilder()
        .setTitle(await book.name)
        .setDescription("niveau : " + await book.level)
        .setColor("#ff54ee")
        .setThumbnail(
          "https://static.wikia.nocookie.net/minecraft_gamepedia/images/5/55/Enchanted_Book.gif"
        );
      embeds.push(embed);
    };
    
    let groupedEmbeds = {};
    embeds.forEach(embed => {
      // on récupère le titre et le niveau du livre
      const title = embed.data.title; 
      const level = embed.data.description;

      const key = `${title}-${level}`; // on crée une clé avec le titre et le niveau du livre (pour reconnaitre les embeds égaux)

      if (!groupedEmbeds[key]) { // si l'embed (la clé) n'existe pas dans le tableau, on l'ajoute
        groupedEmbeds[key] = {
          embed: embed,
          count: 1
        };
      } else {
        groupedEmbeds[key].count++; // sinon on incrémente le nombre d'embeds égaux
      }
    });
    let finalEmbeds = []; // on crée un tableau d'embeds finaux
    for (const key in groupedEmbeds) { 
      if (groupedEmbeds[key].count > 1) { // si le nombre d'embeds égaux est supérieur à 1, on ajoute le nombre d'embeds égaux dans la description de l'embed
        groupedEmbeds[key].embed.setDescription(`${groupedEmbeds[key].embed.data.description}\nNombre: ${groupedEmbeds[key].count}`);
      }
      finalEmbeds.push(groupedEmbeds[key].embed);
    }
    // on renvoie une réponse
    await interaction.editReply({ embeds: finalEmbeds });
  },
};
