const express = require('express')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { getDB } = require('../db/database')

const router = express.Router()

router.post('/register', async (req, res) => {
    const {pseudo, email, password } = req.body


if (!pseudo || !email || !password) {
    return res.status(400).json({ error: 'Tout les champs sont requis'})
}

try {
    const db = await getDB()

    const existant = await db.get(
        'SELECT id FROM users WHERE email = ?', [email]
    )
if (existant) {
    return res.status(400).json({ error: 'Cet email est déjà utilisé'})
}

const passwordHache = await bcrypt.hash(password, 10)

const id = crypto.randomUUID()
await db.run(
    'INSERT INTO users(id, pseudo, email, password_hash) VALUES(?, ?, ?, ?)',
    [id, pseudo, email, passwordHache]
)
res.status(201).json({ id, pseudo, email})

} catch (err) {
    console.error(err)
    res.status(500).json({ error : 'Erreur Serveur'})
}

})

module.exports = router