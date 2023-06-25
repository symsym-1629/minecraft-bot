const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require(`node:fs`);
const Book = require("../database/models/Book.js");
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
            .setName('number')
            .setDescription('Le nombre de livres à ajouter')
            .setRequired(true)
        ) // et le nombre de livres
        .addStringOption(option => option
            .setName('username')
            .setDescription('Yout MC username')
            .setRequired(true)
            .setAutocomplete(false)
        ),
    async autocomplete(interaction) { // l'autocomplétion
        const focusedValue = interaction.options.getFocused(); // on récupère ce que l'utilisateur a déjà tapé
		const choices = [/*récupérer les données de SQLITE*/]
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
        const number = interaction.options.getInteger('number');
        const username = interaction.options.getString('username');
      
        if (level < 1 || level > 5) { // si le niveau est pas entre 1 et 5 on renvoie une erreur
          return interaction.editReply({ content: `Le niveau doit être compris entre 1 et 5.`, ephemeral: true });
        }
        const choices = [/*idem à avant*/]
        
        if (!choices.includes(book.toLowerCase())) { // si le livre n'est pas dans la liste on renvoie une erreur
            return interaction.editReply({ content: `Le livre ${book} n'existe pas.`, ephemeral: true });
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
        return interaction.editReply({ content: `${number} livre(s) ${book} de niveau ${level} a/ont bien été ajouté(s) à votre liste.`, ephemeral: true });
    },// transférer les livres séléctionnés sur une liste que l'on pourra récuperer via une commande
}; 