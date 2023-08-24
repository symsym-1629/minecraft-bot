const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const Book = require("../database/models/Book.js");
// on exporte ici le data, l'autocomplete (qui permet de compléter les arguments du string book) et le execute (ce qui va etre exécuté en gros)
module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
    .setName('listbook') // le nom de la commande
    .setDescription('Liste des livres en vente.'), // la description 


  async execute(interaction) { // l'exécution de la commande
    await interaction.deferReply({ ephemeral: true }); // on dit au bot d'attendre avant de répondre
    let embeds = []; // on crée un tableau d'embeds (pour plus tard)
    let list = await Book.findAll({ where: { reserved: false } }); // on récupère tous les livres non réservés
    list.forEach(book => { // on associe un embed à chaque livre
      let embed = new Discord.EmbedBuilder()
        .setTitle(book.name)
        .setDescription("niveau : " + book.level)
        .setColor("#ff54ee")
        .setThumbnail("https://static.wikia.nocookie.net/minecraft_gamepedia/images/5/55/Enchanted_Book.gif/revision/latest/thumbnail/width/360/height/360?cb=20200428014446");
      embeds.push(embed);
    });
    // ...
    //on regroupe les embeds égaux en 1 seul embed où avec en description nombre : "nombre d'embeds égaux"
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