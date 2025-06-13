const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const TEMPLATE_ID = process.env.SENDGRID_TEMPLATE_ID;

app.use(cors());
app.use(bodyParser.json());

app.post('/send-email', async (req, res) => {
  const { to, name, message } = req.body;

  try {
    const response = await axios.post('https://api.sendgrid.com/v3/mail/send', {
      personalizations: [{
        to: [{ email: to }],
        dynamic_template_data: { name, message }
      }],
      from: {
        email: 'combocriminal0@gmail.com',
        name: 'Combo criminal'
      },
      template_id: TEMPLATE_ID,
    }, {
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('CLAVE:', SENDGRID_API_KEY ? '✅' : '❌');

    res.status(200).send({ message: "Correo enviado" });
  } catch (error) {
    console.error('Error al enviar:', error.response?.data || error.message);
    res.status(500).send({ message: "Error al enviar correo"});
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
