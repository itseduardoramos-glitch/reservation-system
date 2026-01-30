const pool = require('../src/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authUser = async(req, res) => {
    try {
        const { email, password } = req.body;

        console.log(email, password);
        const sql = "SELECT * FROM Usuarios WHERE email = ?";
        const [rows] = await pool.query(sql, [email]);

        console.log([rows]);

        const user = rows[0];

        const valid = await bcrypt.compare(password, user.user_password);


        if(!valid){
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        console.log("valid",valid);
        
        const token = jwt.sign(
            {
                id: user.id_usuario,
                name: user.nombre
            },
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );

        console.log(token);

        res.json({ token });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            mensaje: "Ocurrio un error inesperado en el servidor.",
            error: error.message
        })
    }  
};

module.exports = {
    authUser
}