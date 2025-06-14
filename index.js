const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: ['http://localhost:8100'], // O tu dominio frontend real si lo tenés
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.post('/send-email', async (req, res) => {

  if (!to || !name || !message) {
    return res.status(400).send({ message: "Faltan campos obligatorios (to, name, message)" });
  }

  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Método no permitido' });
  }

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const TEMPLATE_ID = process.env.SENDGRID_TEMPLATE_ID;

  const { to, name, message, subject } = req.body;  

  try {
    const response = await axios.post('https://api.sendgrid.com/v3/mail/send', {
      personalizations: [{
        to: [{ email: to }],
        dynamic_template_data: { name, message },
        subject: subject
      }],
      from: {
        email: 'combocriminal0@gmail.com',
        name: 'Combo criminal'
      },
      template_id: TEMPLATE_ID
    }, {
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('CLAVE:', SENDGRID_API_KEY ? '✅' : '❌');

    res.status(200).send({ message: "Correo enviado" });
  } catch (error) {
    console.error('Error al enviar:', {
      message: error.message,
      data: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    res.status(500).send({ message: "Error al enviar correo"});
    console.log('email:',to);
    console.log('message',message);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
