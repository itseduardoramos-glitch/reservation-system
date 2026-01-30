const bcrypt = require('bcryptjs');
const pool = require('../src/db');

/**
 * Function to create users
 * 
 * TO CREATE A USER, JUST RUN node src/createUser and a user is going to be created with the credencials set in the variables
 */
async function createUser() {
    const password = "123456"; //Another string can be used as a password
    const hash = await bcrypt.hash(password, 10);

    await pool.query(
        "INSERT INTO Usuarios (nombre, telefono, email, user_password) VALUES (?, ?, ?, ?)",
        ["user2", "1090909090","user2@gmail.com", hash]
    );

    console.log("usuario creado")

    process.exit();
}

createUser();