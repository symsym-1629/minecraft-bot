// Importation des modules
const Discord = require("discord.js");
const fs = require("node:fs");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const database = require("./database/init.js");
const Book = require("./database/models/Book.js");
const User = require("./database/models/User.js");
const { token, clientID } = require("./config/config.json");
const myIntents = new Discord.IntentsBitField();

// ajoute les intents pour récupérer les membres et les serveurs plus tard (obligatoire)
myIntents.add(Discord.IntentsBitField.Flags.Guilds, Discord.IntentsBitField.Flags.GuildMembers );
const client = new Discord.Client({
  intents: myIntents
});

client.commands = new Discord.Collection();
const commandsToPush = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// créer une nouvelle entrée dans la collection command
	// avec comme clé le nom de la commande et la valeur toute l'export de la commande (data + execute) qui va être utilisé plus tard
	client.commands.set(command.data.name, command);
  // ajoute la commande à la liste des commandes à push
  commandsToPush.push(command.data.toJSON());
  console.log(command.data.toJSON());
}
// code fourni par discord.js pour push les commandes
const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationCommands(clientID), { body: commandsToPush },)
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

client.once("ready", async () => {
  // quand le bot est prêt, on mets un message dans la console
  console.log("Le bot est en ligne, tout roule");
  // on set le status du bot
  client.user.setActivity("les livres", { type: "WATCHING" });
  // on se connecte à la base de données
  try {
    await User.sync();
    await Book.sync();
    await database.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
// on log si erreur ou warning
client.on("error", console.error);
client.on("warn", console.warn);

client.on(Discord.Events.InteractionCreate, async interaction => {

  // on log qu'une interaction a été déclenchée
  console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
  // si l'interaction est une interaction d'autocomplete
  if (interaction.isAutocomplete()) {
    // on récupère le nom de la commande
    const command = interaction.client.commands.get(interaction.commandName);
    
		if (!command) {
      // si la commande a pas de nom, on envoie un message d'erreur
      console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}
    
		try {
      // on exécute la fonction autocomplete de la commande
      await command.autocomplete(interaction);
		} catch (error) {
      console.error(error);
		}
	}
  else if (interaction.isChatInputCommand()) {
    // on récupère le nom de le commande
    const command = interaction.client.commands.get(interaction.commandName);
    // si la commande n'a pas de nom, on ne fait rien
    if (!command) return;
    try {
      // on exécute la commande
      await command.execute(interaction);
    } catch (error) {
      // si il y a une erreur, on log l'erreur et on envoie un message à l'utilisateur
      console.error(error);
      await interaction.reply({content: `Il y a eu une erreur en essayant d\'exécuter cette commande !, merci d\'envoyer un screen de ce message à @symsym_ : \`\`\`${error}\`\`\``, ephemeral: true});
    }
  }
});
// on se connecte au bot
client.login(token)
