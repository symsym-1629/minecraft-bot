const { Sequelize } = require('sequelize');
const database = require('../init.js');

// on définit la table users qui va contenir ce que les utilisateurs ont réservés
var User = database.define('users', {
    userid: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        unique: true
    },
    reserved: {
        type: Sequelize.STRING, // on va afficher les bouquins réservés par leur id sous la forme "id1,id2,id3"
    }
});

module.exports = User;