const { getIO } = require('../src/socket');
const pool = require('../src/db');

/**
 * Function to save the date
 * @param {*} req request received
 * @param {*} res response sent
 */
const postDate = async (req, res) => {
  try {
    const { date, reservationId } = req.body;
    const userId = req.user.id;

    const io = getIO();

    // It verifies if the user already has a confirmed reservatrion
    const [confirmed] = await pool.query(
      `
      SELECT id_reserva
      FROM Reservas
      WHERE id_usuario = ?
        AND estado = 'Confirmada'
      LIMIT 1
      `,
      [userId]
    );

    if (confirmed.length) {
      return res.status(409).json({
        message: "Ya tienes una reservación confirmada"
      });
    }

    // Update
    if (reservationId) {
      const [rows] = await pool.query(
        "SELECT fecha FROM Reservas WHERE id_reserva = ? AND id_usuario = ?",
        [reservationId, userId]
      );

      if (!rows.length) {
        return res.status(404).json({ message: "Reserva no encontrada" });
      }

      // Date is normalized
      const oldDate = rows[0].fecha
        .toISOString()
        .split("T")[0];

      await pool.query(
        "UPDATE Reservas SET fecha = ?, id_usuario = ? WHERE id_reserva = ?",
        [date, userId, reservationId]
      );

      // We create the sockets to get info in real-time
      io.emit("reservation:released", { date: oldDate });
      io.emit("reservation:created", { date });

      return res.json({ ok: true, id: reservationId });
    }

    // Insert
    const [result] = await pool.query(
      "INSERT INTO Reservas (fecha, estado, id_usuario) VALUES (?, ?, ?)",
      [date, "En proceso", userId]
    );

    io.emit("reservation:created", { date });

    return res.status(201).json({
      ok: true,
      id: result.insertId
    });

  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "La fecha ya está reservada"
      });
    }

    res.status(500).json({ error: error.message });
  }
};


/**
 * Function to delete the selected date once the tab is closed or abandoned
 * @param {*} req request recieved
 * @param {*} res response sent
 */
const releaseReservation = async(req, res) => {
    try {
        const { id } = req.body;
        const userId = req.user.id;

        const io = getIO();

        if(id) {
            await pool.query("DELETE FROM Reservas WHERE id_reserva = ? and id_usuario = ? and estado = ?", [id, userId, "En proceso"]);

            io.emit("reservation:released", { date });
            res.sendStatus(204);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Function that runs when the reservation form is submited
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const confirmReservation = async (req, res) => {
  try {
    const { reservationId, tipoServicio, celular } = req.body.form;
    const userId = req.user.id;

    const io = getIO();

    if (!reservationId || !tipoServicio || !celular) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios"
      });
    }

    // Validar celular (opcional pero recomendado)
    if (!/^\d{10}$/.test(celular)) {
      return res.status(400).json({
        message: "Celular inválido"
      });
    }

    // Verificar que la reserva exista y sea del usuario
    const [rows] = await pool.query(
      `
      SELECT fecha, estado
      FROM Reservas
      WHERE id_reserva = ?
        AND id_usuario = ?
      `,
      [reservationId, userId]
    );

    if (!rows.length) {
      return res.status(404).json({
        message: "Reserva no encontrada"
      });
    }

    if (rows[0].estado !== "En proceso") {
      return res.status(409).json({
        message: "La reserva ya fue confirmada o no es válida"
      });
    }

    // Actualizar reserva
    await pool.query(
      `
      UPDATE Reservas
      SET
        servicio = ?,
        telefono = ?,
        estado = 'Confirmada'
      WHERE id_reserva = ?
      `,
      [tipoServicio, celular, reservationId]
    );

    // Socket for the reservation already confirmed
    io.emit("reservation:confirmed", {
      date: rows[0].fecha.toISOString().split("T")[0],
      reservationId
    });

    return res.status(200).json({
      ok: true,
      message: "Reservación confirmada correctamente"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al confirmar la reservación"
    });
  }
};




module.exports = {
    postDate,
    releaseReservation,
    confirmReservation
};