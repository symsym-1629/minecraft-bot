const { Sequelize } = require('sequelize');
// on crée une nouvelle base de données avec l'uri de la base de données
const database = new Sequelize("sqlite://database.sqlite");
// on exporte pour pouvoir accéder à la database des autres fichiers
module.exports = database;