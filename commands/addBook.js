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
        ) // et le nombre de livres
        .addStringOption(option => option
            .setName('username')
            .setDescription('Your MC username')
            .setRequired(true)
            .setAutocomplete(false)
        ),
    async autocomplete(interaction) { // l'autocomplétion
        const focusedValue = interaction.options.getFocused(); // on récupère ce que l'utilisateur a déjà tapé
		const choices = ['aqua affinity', 'bane of arthropods', 'blast protection', 'channeling', 'curse of binding', 'curse of vanishing', 'depth strider', 'efficiency', 'feather falling', 'fire aspect', 'fire protection', 'flame', 'fortune', 'frost walker', 'impaling', 'infinity', 'knockback', 'looting', 'loyalty', 'luck of the sea', 'lure', 'mending', 'quick charge', 'piercing', 'multishot', 'power', 'projectile protection', 'protection', 'punch', 'respiration', 'riptide', 'sharpness', 'silk touch', 'smite', 'soul speed', 'sweeping edge', 'thorns', 'unbreaking']
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
        const username = interaction.options.getString('username');
      
        if (level < 1 || level > 5) { // si le niveau est pas entre 1 et 5 on renvoie une erreur
          return interaction.editReply({ content: `Le niveau doit être compris entre 1 et 5.`, ephemeral: true });
        }
        const choices = ['aqua affinity', 'bane of arthropods', 'blast protection', 'channeling', 'curse of binding', 'curse of vanishing', 'depth strider', 'efficiency', 'feather falling', 'fire aspect', 'fire protection', 'flame', 'fortune', 'frost walker', 'impaling', 'infinity', 'knockback', 'looting', 'loyalty', 'luck of the sea', 'lure', 'mending', 'quick charge', 'piercing', 'multishot', 'power', 'projectile protection', 'protection', 'punch', 'respiration', 'riptide', 'sharpness', 'silk touch', 'smite', 'soul speed', 'sweeping edge', 'thorns', 'unbreaking']
        
        if (!choices.includes(book.toLowerCase())) { // si le livre n'est pas dans la liste on renvoie une erreur
            return interaction.editReply({ content: `Le livre ${book} n'existe pas.`, ephemeral: true });
        }
        for (let i = 0; i < number; i++) { // pour chaque nombre on crée un livre dans la base de données
          await Book.create({
            name: book.toLowerCase(),
            level: level,
            username: username,
            reserved: false
          }).then(Book.sync());
        }
        // on renvoie une réponse
        return interaction.editReply({ content: `${number} livre(s) ${book} de niveau ${level} a/ont bien été ajouté(s).`, ephemeral: true });
    },
}; 