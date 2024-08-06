// db.js
const mysql = require('mysql2');

// Utwórz połączenie
const connection = mysql.createConnection({
  host: 'localhost',      // Adres serwera bazy danych
  user: 'root',           // Użytkownik bazy danych
  password: '',           // Hasło użytkownika bazy danych
  database: 'inzynierka'  // Nazwa bazy danych
});

// Połącz z bazą danych
connection.connect((err) => {
  if (err) {
    console.error('Błąd połączenia z bazą danych:', err.stack);
    return;
  }
  console.log('Połączono z bazą danych jako id ' + connection.threadId);
});

module.exports = connection;
