# minecraft-bot

Le fichier principal est [index.js](index.js)

### Pour démarrer le bot

Pour démarrer le bot il faut d'abord installer [node.js](https://nodejs.org/en/download/).

Il faut dupliquer le fichier [config.json.example](config/config.json.example) et le renommer en `config.json` et remplir les champs avec les informations de votre bot :
```json
{
    "token": "votre token",
    "clientID": "votre ID de client"
}
```

Ensuite il faut installer les dépendances avec la commande `npm install` et pour finir il faut démarrer le bot avec la commande `node .`

Il est inutile d'aller voir les fichiers suivants : 
- [.gitignore](.gitignore)
- [package.json](package.json)
- [package-lock.json](package-lock.json)

Le dossier database contient tout les fichiers utiles à la création de la base de données et des différentes entrées de celle-ci.

Le dossier config contient le fichier de configuration du bot.

Le dossier commands contient tout les fichiers de commandes du bot.