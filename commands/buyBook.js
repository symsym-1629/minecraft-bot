const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require(`node:fs`);
const Book = require("../database/models/Book.js");
const User = require("../database/models/User.js");

const choices = ['aqua affinity', 'bane of arthropods', 'blast protection', 'channeling', 'curse of binding', 'curse of vanishing', 'depth strider', 'efficiency', 'feather falling', 'fire aspect', 'fire protection', 'flame', 'fortune', 'frost walker', 'impaling', 'infinity', 'knockback', 'looting', 'loyalty', 'luck of the sea', 'lure', 'mending', 'quick charge', 'piercing', 'multishot', 'power', 'projectile protection', 'protection', 'punch', 'respiration', 'riptide', 'sharpness', 'silk touch', 'smite', 'soul speed', 'sweeping edge', 'thorns', 'unbreaking']
// on exporte ici le data, l'autocomplete (qui permet de compléter les arguments du string book) et le execute (ce qui va etre exécuté en gros)
module.exports = {
     data: new SlashCommandBuilder()
        .setName('buybook') // le nom de la commande
        .setDescription('Réserver un livre') // la description
        .addStringOption(option => option
            .setName('book')
            .setDescription('Le livre que vous voulez récuperer')
            .setRequired(true)
            .setAutocomplete(true)
        ) // l'option pour quel livre à récuperer
        // Il faut faire en sorte que le book soit book + niv d'enchant
        .addIntegerOption(option => option
            .setName('level')
            .setDescription('Le niveau du livre que vous voulez récuperer')
            .setRequired(true)
        ) // et le nombre de livres
        .addStringOption(option => option
            .setName('username')
            .setDescription('Your MC username')
            .setRequired(true)
            .setAutocomplete(false)
        ),
    async autocomplete(interaction) { // l'autocomplétion
        const focusedValue = interaction.options.getFocused(); // on récupère ce que l'utilisateur a déjà tapé
		
		// on défini tout les choix dispos
        const filtered = choices.filter(choice => choice.startsWith(focusedValue)); // on filtre les choix pour ne garder que ceux qui commencent par ce que l'utilisateur a tapé
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })), // on renvoie les choix filtrés
		); 
    },
    async execute(interaction) { // l'exécution de la commande
        await interaction.deferReply({ephemeral: true}); // on dit au bot d'attendre avant de répondre
        // on récupère les arguments
        const book = interaction.options.getString('book'); 
        const level = interaction.options.getInteger('level');
        const username = interaction.options.getString('username');
      
        if (level < 1 || level > 5) { // si le niveau est pas entre 1 et 5 on renvoie une erreur
          return interaction.editReply({ content: `Le niveau doit être compris entre 1 et 5.`, ephemeral: true });
        }
        
        if (!choices.includes(book.toLowerCase())) { // si le livre n'est pas dans la liste on renvoie une erreur
            return interaction.editReply({ content: `Le livre ${book} n'existe pas.`, ephemeral: true });
        }
        try {
            const livre = await Book.findOne({
                where: { 
                    name: book, 
                    level: level,
                    reserved: false 
                } 
            })
            if (!livre) { // si le livre n'est pas dans la liste on renvoie une erreur
                return interaction.editReply({ content: `Il n'y a plus de livres ${book} disponibles.`, ephemeral: true });
            }
            await livre.update({ reserved: true });
            await Book.sync();
            
            // create in not exists or update user
            const user = await User.findOrCreate({
                where: {
                    username: username
                },
                defaults: {
                    username: username,
                    reserved: null
                }
            });
            await user[0].update({
                reserved: user[0].reserved ? user[0].reserved + ',' + livre.id : livre.id
            });
            await User.sync();
            
            return interaction.editReply({ content: `Le livre ${book} de niveau ${level} appartenant à ${livre.username} a bien été réservé. ||id: ${livre.id}||`, ephemeral: true });
        } catch (error) {
            console.log(error);
            return interaction.editReply({ content: `Il n'y a plus de livres ${book} disponibles.`, ephemeral: true });
        };
        
        // on renvoie une réponse
        
    },// transférer les livres séléctionnés sur une liste que l'on pourra récuperer via une commande
}; 