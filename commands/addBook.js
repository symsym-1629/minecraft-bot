const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require(`node:fs`);
const Book = require("../database/models/Book.js");
// on exporte ici le data, l'autocomplete (qui permet de compléter les arguments du string book) et le execute (ce qui va etre exécuté en gros)
module.exports = {
     data: new SlashCommandBuilder()
        .setName('addbook') // le nom de la commande
        .setDescription('Ajoute un livre à la liste des livres.') // la description
        .addStringOption(option => option
            .setName('book')
            .setDescription('Le livre à ajouter')
            .setRequired(true)
            .setAutocomplete(true)
        ) // l'option pour quel livre à ajouter
        .addIntegerOption(option => option
            .setName('level')
            .setDescription('Le niveau de l\'enchantement')
            .setRequired(true)
        ) // le niveau du livre
        .addIntegerOption(option => option
            .setName('number')
            .setDescription('Le nombre de livres à ajouter')
            .setRequired(true)
        ), // et le nombre de livres
    async autocomplete(interaction) { // l'autocomplétion
        const focusedValue = interaction.options.getFocused(); // on récupère ce que l'utilisateur a déjà tapé
		const choices = ['Aqua Affinity', 'Bane of Arthropods', 'Blast Protection', 'Channeling', 'Curse of Binding', 'Curse of Vanishing', 'Depth Strider', 'Efficiency', 'Feather Falling', 'Fire Aspect', 'Fire Protection', 'Flame', 'Fortune', 'Frost Walker', 'Impaling', 'Infinity', 'Knockback', 'Looting', 'Loyalty', 'Luck of the Sea', 'Lure', 'Mending', 'Quick Charge', 'Piercing', 'Multishot', 'Power', 'Projectile Protection', 'Protection', 'Punch', 'Respiration', 'Riptide', 'Sharpness', 'Silk Touch', 'Smite', 'Soul Speed', 'Sweeping Edge', 'Thorns', 'Unbreaking']
		// on définie tout les choix dispos
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
        const number = interaction.options.getInteger('number');
      
        if (level < 1 || level > 5) { // si le niveau est pas entre 1 et 5 on renvoie une erreur
          return interaction.editReply({ content: `Le niveau doit être compris entre 1 et 5.`, ephemeral: true });
        }
      
        for (let i = 0; i < number; i++) { // pour chaque nombre on crée un livre dans la base de données
          await Book.create({
            name: book,
            level: level,
            userid: interaction.user.id,
            reserved: false
          });
        }
        // on renvoie une réponse
        return interaction.editReply({ content: `${number} livre(s) ${book} de niveau ${level} a/ont bien été ajouté(s).`, ephemeral: true });
    },
}; 