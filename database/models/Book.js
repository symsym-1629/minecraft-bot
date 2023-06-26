const { Sequelize } = require('sequelize');
const database = require('../init.js');

// on définit la table books qui va contenir les livres à vendre
var Book = database.define('books', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
    },
    level: {
        type: Sequelize.INTEGER,
    },
    username: {
        type: Sequelize.STRING, 
    },
    reserved: {
        type: Sequelize.BOOLEAN,
    }
});

module.exports = Book;